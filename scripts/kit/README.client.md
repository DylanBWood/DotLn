# DotLn launchpad

This repository is a launchpad instance exported from DotLn core: the control
plane under `scripts/` with its suites, the compiled runtime of
`@dotln/kernel`, `@dotln/compiler` and `@dotln/skeleton` under
`packages/<name>/dist/src/`, the build-free Beacon workspace under
`packages/beacons`, the Contributor harness bundle under `.claude/`,
`.agents/` and `.codex/` that the export's own `node scripts/harness.mjs emit`
wrote from that runtime, the operating documents and the templates a new
instance starts from. `UPSTREAM.md` names the core commit and tag the kit was
read from; `KIT-MANIFEST.json` lists every kit file with its SHA-256.
Everything the manifest does not list is instance-owned: the configuration,
the control records, work orders, evidence, verification and final-review
reports, the operating contract's hand-written floor and this instance's
overlays.

## First steps

1. The export is already a Git repository on `main` with no commit: review the
   files and commit them before any control-plane command. The control plane
   records checkpoints as Git refs and needs at least one commit. An export
   made inside another repository's work tree is an embedded repository there.
2. `npm ci` (or `npm ci --offline` with a warm cache): installs the pinned
   development dependencies from the exported lockfile and links the four
   `@dotln/*` workspaces. The export seeds the same links under
   `node_modules/@dotln/` so that its own harness emit could run; `npm ci`
   replaces them with identical ones.
3. `node scripts/harness.mjs check`: the pinned runtime files the hooks
   import (the snapshot) and every generated surface are at their pinned
   bytes; `KIT-MANIFEST.json` hashes the whole compiled runtime. The hooks
   import an ignored, content-addressed snapshot under `.runtime/harness/`,
   which the export's emit installed from `packages/<name>/dist/`; after
   cloning this repository elsewhere, run `node scripts/bootstrap.mjs` once
   (`npm ci`, then `node scripts/harness.mjs emit`, which needs the installed
   workspace links) to install it again. Until then each hook reports
   `snapshot-missing` once per session and host permissions alone decide.
4. Register the private local-terms list at `docs/control/local/terms.txt`,
   one term per line; the directory is ignored by Git. `npm run terms -- check
   <paths>` prints `local-terms list: present` or `unavailable`, and refuses on
   a match by file and line without printing the term.
5. Copy `dotln.config.example.json` to `dotln.config.json` only when this
   instance moves a document root; an absent file means the default layout
   under `docs/`. The example declares only the `docs` base, from which every
   other root derives; a root declared on its own stays where it is declared
   when the base moves.
6. Activate the pre-drafted first order:
   `npm run resume -- activate WO-001 docs/work-orders/WO-001-environment-truth.md`,
   then `npm run resume -- status` (`--json` is the canonical record).
7. Open a session that reads the operating contract (`CLAUDE.md`, symlinked as
   `AGENTS.md`); its generated harness block routes each resume phrase to the
   role skill under `.claude/skills/` or `.agents/skills/`, and the generated
   hooks enforce the compiled refusals where the harness runs them.

## What runs here, and what does not

With the runtime present, every lifecycle command runs here, including the
Codex dispatches that reserve a writer (`next`, `verify`, `fix`,
`final-review`, `release-close`), and `node scripts/harness.mjs check` and
`emit` verify and regenerate the bundle. `npm run build` needs the TypeScript
source core keeps, and `npm test` and `npm run harness` build before they run,
so neither runs here; that is a recorded limit of the kit (core's follow-up
FUP-8fb7ae17dd0fad5b in `docs/planning/followups.json` at the commit
`UPSTREAM.md` names), not a defect of your instance. `scripts/console-fixtures.mjs`
imports `@dotln/console`, which the kit does not carry, and fails at import
here; the vertical's browser evidence reaches `@dotln/browser-evidence` only
on the path that uses it, and `npm run plan -- conditions` reports its
collect-sources row as unavailable because that row reaches `@dotln/console`.
`UPSTREAM.md` names the commit to read them at.

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
`scripts/kit/` among them), `packages/beacons/**`, the compiled runtime
`packages/<name>/dist/src/**` with its `package.json` for kernel, compiler and
skeleton, the build-free modules under `packages/*/src/*.mjs`, the harness
bundle under `.claude/`, `.agents/` and `.codex/` (`.claude/harness-manifest.json`
among them), `package.json`, `package-lock.json`, `dotln.config.example.json`,
`UPSTREAM.md`, the license files, `docs/product/07-execution-guide.md`,
`docs/product/08-publication-compiler.md`, `docs/PLAYBOOK.md` and
`docs/publication/implementation-overlay-template.md`. A kit update replaces
unmodified kit files; a re-emit regenerates the bundle from
the runtime. Instance files are yours: `dotln.config.json`, `docs/control/`,
`docs/work-orders/`, `docs/evidence/`, `docs/verifications/`,
`docs/final-reviews/`, `docs/workstreams/`, `docs/repositories/`,
`docs/planning/`, the product overlay and the build overlay, `CLAUDE.md`
(its generated harness block is checked by `node scripts/harness.mjs check`
through the listed harness manifest, changed by an update only through an
explicitly opted-in phrase action),
`AI-HARNESS-SECURITY.md`, this README, `.gitignore` and every root README the
export seeded once, the workstream and repository-profile conventions
included; their upstream sources stay under `scripts/kit/` for a later
revision to refresh. The generated `.claude/settings.json`, hooks, skills and
Codex files are kit files a re-emit rewrites; operator-owned Claude Code
settings belong in the ignored `.claude/settings.local.json`. Two READMEs are generated rather than seeded:
`docs/work-orders/` gets the index at the first lifecycle transition
(`activate`) and `docs/lineage/` gets its index from
`node scripts/lineage.mjs index` once a ledger exists.

## Taking upstream updates

From a clean DotLn core checkout at the commit you want to take, with its
pinned dependencies installed, run:

```sh
node scripts/launchpad.mjs export --update /absolute/path/to/starter
```

The destination must already contain a valid `KIT-MANIFEST.json`. Update
checks every prior kit file before writing: missing, unreadable or nonregular
files refuse the operation by path. It replaces files that still match their
prior hashes, adds new kit files and removes dropped files only when unchanged.
Locally edited files are listed as refused and keep their prior manifest hashes,
including dropped files, so a repeat update refuses them again. A new kit path
occupied by an instance file is also refused and stays outside the manifest.
Resolve these files by hand and review the update before committing it.

The manifest records the new source commit; refused files can still come from
an older revision. `UPSTREAM.md` takes the new provenance when it is unmodified.
The export's original license posture is retained. The command prints the
kit's dated instance actions and the instruction to run, inside the starter:

```sh
node scripts/harness.mjs emit
```

Review that re-emit with this instance's configuration and overlay. Updates
flow from core into the starter as a reviewed change, then from the starter
into forks through each fork's ordinary upstream merge and reviewed re-emit.
An agent running the update needs its destination inside a granted write root;
an order naming a destination alone does not grant it.

## Opting in to instance actions

By default, updates leave instance files byte-identical and only print the
actions for you to carry out. To apply the kit's declared mechanical actions,
set `"kit": { "applyInstanceActions": true }` in the instance's
`dotln.config.json` (schema `"version": 1`) and pass `--apply` to the update
command. Both are required. With either absent, no instance action runs;
`--apply` without the configuration opt-in refuses before writing.

`scripts/kit/KIT-ACTIONS.json` is manifest-listed, schema 1, initially with an
empty `actions` array. Every action has a distinct `id`, a `date` in
`YYYY-MM-DD` form and one of these closed shapes:

- `rename-root`: `root` is a configuration root name, `from` its current
  relative path and `to` its new relative path. The directory and its files
  move together, and the configuration records the new root. Existing target
  paths, overlaps with kit files or protected runtime/install paths, symlinks
  and unreadable files refuse.
- `add-config-field`: `field` is a dotted configuration key and `value` its
  default. An existing value is preserved; the resulting configuration must
  pass the closed configuration schema.
- `change-phrase`: `from` and `to` are nonempty literal strings in
  `CLAUDE.md`. Exactly one occurrence is replaced; an already-applied change
  is preserved, and a missing or ambiguous phrase refuses.

Actions come from the new core commit's typed file, never from prose or local
edits to that file. Unknown kinds and fields refuse. All kit inputs and actions
are checked before destination writes, and each applied or preserved action
is listed in the output. No control event is appended. Repeated actions preserve
the already-migrated state; keep the output with your review of the update.

## License

The license files this export carries are listed in the manifest and
`UPSTREAM.md`. An export made with `--license none` carries
`LICENSE-PENDING.md` in their place, a notice that grants no rights, and its
generated `package.json` says `UNLICENSED`; replace both with the terms the
owner of this repository decides. The verbatim `packages/*/package.json` files
keep upstream's label in either export because they are byte-identical to the
commit. The compiled runtime is this project's own output under the same
terms; the export bundles no third-party file, and `npm ci` installs the
pinned development dependencies from the registry or a local cache.
