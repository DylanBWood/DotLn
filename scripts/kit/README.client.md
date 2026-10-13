# DotLn launchpad

This repository is a launchpad instance exported from DotLn core: the control
plane under `scripts/` with its suites, the compiled runtime of
`@dotln/kernel`, `@dotln/compiler` and `@dotln/skeleton` under
`packages/<name>/dist/src/` and compiled tests under `dist/test/`, the build-free Beacon workspace under
`packages/beacons`, the Contributor harness bundle under `.claude/`,
`.agents/` and `.codex/` that the export's own `node scripts/harness.mjs emit`
wrote from that runtime, the operating documents and the templates a new
instance starts from. `UPSTREAM.md` names the core commit and tag the kit was
read from; `KIT-MANIFEST.json` lists every kit file with its SHA-256.
Everything the manifest does not list is instance-owned: the configuration,
the control records, work orders, evidence, verification and final-review
reports, the operating contract's hand-written floor and this instance's
overlays.

The Contributor build is starter content, not kit law. The instance owns its
build through a JSON overlay, conventionally `build/overlay.json`, selected by
`"build": { "overlay": "build/overlay.json" }` in `dotln.config.json`
(`"version": 1`). With no overlay selected, emit preserves the default build.
The overlay is instance-owned and stays outside `KIT-MANIFEST.json`; its path
and file SHA-256 appear in `.claude/harness-manifest.json`. Repositories and
classes remain in `dotln.config.json`, independently of this build.

For example, this overlay reduces writer authority and removes two optional
supports:

```json
{
  "version": 1,
  "unequip": ["tinkerer-economy", "process-cost"],
  "narrow": { "resourceLimits": { "writers": 0 } }
}
```

Run `node scripts/harness.mjs emit`, then `node scripts/harness.mjs check`.
Overlay version 1 has only these keys:

- `version`: required, `1`; `build`: optional, `"contributor"` or `"none"`.
  `{"version":1,"build":"none"}` removes the owned generated surfaces,
  preserves the hand-written floor and keeps an empty harness manifest for
  `check`. It accepts no other overlay keys. Re-enable the build by removing
  `build: none` or the configuration's overlay selection, then emit again.
- `identity`: a complete replacement with `identityId`, positive integer
  `version`, `name`, and string arrays `dispositions`, `invariants`,
  `updateLaws` and `lineage`. Its text reaches the bundle; it cannot rewrite
  the hand-written Clean Room floor or the active Clean Room mechanism.
- `equip` and `unequip`: distinct arrays of existing support switch IDs:
  `adjacent-repair`, `decision-receipts`, `follow-up-queue`,
  `operator-check-in`, `communication-observation`,
  `communication-recommendation`, `communication-intent`, `tinkerer-economy`,
  `process-cost`, `goal-alignment`. An ID cannot appear in both arrays;
  competing communication supports still refuse. These switches do not
  define new units or remove the locked floor.
- `narrow`: optional `allowedEffects` replaces the kit's pre-grant allow
  list; `deniedEffects`, `requiredEvidence`, `revocationEventTypes` and
  `revocationConditions` add restrictions. A revocation condition has
  `registryId`, positive integer `version`, and optional object `params`.
  `resourceLimits` lowers named nonnegative integer ceilings; `expiresAt`
  shortens expiry. The inherited presence phase is narrowed with the build.
  Ungranted widening refuses with `AUTHORITY WIDENING`.
- `grants`: explicit additions applied by the compiler after narrowing,
  alongside the kit's existing temporary-write grants. Each has `grantId`,
  positive integer `version`, `grantedBy` (`operator` or `host-policy`),
  exact `effects`, optional exact `operations`, `repo: "project"` and a
  nonempty `reason`. The manifest preserves this provenance. Grants cannot
  raise resource ceilings, extend expiry, bypass the hand-written floor or
  change the host's own permissions. A granted effect removes its exact
  denial; a wider wildcard denial still refuses. Omit grants to retain the
  kit's existing grant set.

Unreadable files, non-JSON, unknown keys and wrong types refuse by overlay
path before emit creates its output or changes the bundle. The file must be
a regular file contained in the launchpad. Re-emitting the same overlay and
runtime produces the same bytes; `check` detects drift against both.

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
   Run `npm run meta` to generate the decision index from this instance's own
   records before its first gate, and again whenever its decisions change.
   Run `node scripts/lineage.mjs index` to generate the lineage index.
7. Open a session that reads the operating contract (`CLAUDE.md`, symlinked as
   `AGENTS.md`); its generated harness block routes each resume phrase to the
   role skill under `.claude/skills/` or `.agents/skills/`, and the generated
   hooks enforce the compiled refusals where the harness runs them.

## Planning in this instance

The same planning commands run here using this instance's records. Commit the
export and install its pinned dependencies first. On clean `main`, run
`npm run plan -- start first-pass`; it creates the planning branch and reads
the current follow-up feed. Draft this instance's orders and sequence, then
record its dated planning pass in `docs/lineage/idea-ledger.md`.

- `npm run plan -- followups` pages the register; `--export <file>` exports it;
  `--apply <batch.json>` applies dispositions against the revision read.
  `npm run plan -- followups --sync` reconciles changed public sources.
- `npm run plan -- failures` and `npm run plan -- conditions` report local
  evidence. Core condition sources absent here are named and have unknown
  verdicts; `collect-sources` reports the unavailable console package.
- `npm run meta` refreshes the decision index and register.
  `npm run meta -- --plan-cost` records costs for the committed orders and
  current planning inputs. Commit the planning subject and cost table before
  refutation; keep them fixed through receipt filing.
- The installed planner skill dispatches the independent refutation worker.
  `npm run plan -- refute` prints its canonical prompt from this instance's
  sequence and orders. `npm run plan -- receipt <result.json> --statement
  <statement.txt>` validates and commits the returned judgment;
  `npm run plan -- check` checks the receipt and continuing subject.
- `npm run entropy -- subject` names the next review action. Live review and
  refutation belong to the operator's instance; the export fixture exercises
  only `review --transport fake` and its receipt, never a live model.
- Refresh `npm run work-orders -- index` and `node scripts/lineage.mjs index`;
  their `--check` forms check the projections. Run `node scripts/docs-check.mjs`,
  `npm run publication:check`, `npm run reader -- check` and
  `npm run test:docs` before handing off the planning pass.
- Release-close reads can be inspected with `npm run release -- check-surfaces
  --local` and `npm run resume -- status`. With no lifecycle order declared,
  the former reports that release surfaces are unavailable. These reads do
  not publish anything.

Export writes these instance-owned seeds once; updates leave their bytes alone:
`docs/planning/sequence.md`, `docs/planning/followups.json` (empty schema-1
register), `docs/control/doc-ceilings.json` (no documents),
`docs/control/doc-baseline.json` (empty editorial baseline),
`docs/control/budgets.json` (kit defaults, no acceptances), and
`docs/lineage/idea-ledger.md` (header and status vocabulary only). None is
manifest-listed. Generated decision, work-order and lineage indexes are
created by their commands. Core's register, ledger, editions and score history
are not copied.

A fresh instance has no `docs/product/00-vision.md`,
`docs/product/13-uifa-roles.md`, `docs/planning/capability-table.md` or
`docs/planning/critical-path-2026-09-08.md`. The planning subject names absent
inputs as unavailable; it invents no product goals. Declaring one makes its
normal format validation apply. The document check judges instance-owned
product documents and links; carried operating documents retain their
upstream history. No publication editions means `publication: no editions
declared`. No reader profiles, examples or score rows means no editorial
records to verify; a recorded score whose tag object is missing fails with
its release, object and restoring fetch command.

## What runs here, and what does not

After the first steps above, `npm test`, `npm run test:docs` and
`npm test -- --review` run inside this instance without package source. Each
selection first runs `kit-verify` instead of `build`. It hashes every
manifest-listed compiled runtime and test file, and refuses a changed,
missing or nonregular compiled file by path before any other task. Other
kit-file changes produce one advisory line, so your script edits can still
be judged by the gates. Run `node scripts/launchpad.mjs verify` directly for
the same check.

The observed selections in a fresh fixture instance are:

- `npm test`: `kit-verify`, `format`, `release-preparation`, `target-worktree`, `publication-fixtures`, `backup-intake`, `beacon-portability`, `checkpoint`, `work-orders-fixtures`, `siblings-fixtures`, `adjacent-queue`, `derived-orders`, `portfolio`, `codex-continuation`, `authority-grants`.
- `npm run test:docs`: `kit-verify`, `format`, `publication`, `docs-check`, `index`, `siblings`, `lineage`, `resident-bind`, `harness`, `harness-context`, `plan-refutation-current`, `artifact-corpus`, `meta`, `registrations`, `plan`, `reader-profiles`, `entropy`.
- `npm test -- --review`: `kit-verify`, `format`, `release-preparation`, `target-worktree`, `publication-fixtures`, `backup-intake`, `beacon-portability`, `checkpoint`, `work-orders-fixtures`, `siblings-fixtures`, `adjacent-queue`, `derived-orders`, `portfolio`, `codex-continuation`, `authority-grants`, `fixture-temp-root`, `configuration-root`, `harness`, `harness-context`, `mutation`, `meta`, `registrations`.

Review uses the shared runner's changed-machinery selection. This fixture
has no upstream comparison ref, so its review selects every carried
machinery row; an instance with a comparison ref runs those selected by
its changes. Passing tasks at the same code identity may be reused;
`kit-verify` always runs fresh.

These suite rows stay core-only. Every selection, including `--list`, prints
each name and its reason. A row without a declaration runs in its ordinary
selection; these declarations do not change core's gate. An explicit
`--only <suite>` request for an unavailable row fails with its name and
reason, including with `--list`, and records no gate result.

| Suite | Input the kit does not carry |
| --- | --- |
| `artifact-evidence` | package sources and core artifact-identity evidence edition |
| `authority-evidence` | core authority evidence edition and historical Git objects |
| `browser-evidence` | browser-evidence package and browser runtime are not shipped |
| `comment-labels` | core comment fingerprint baseline |
| `comment-labels-fixtures` | core corpus profile collector |
| `compiler` | compiler package source audits |
| `console` | console package is not shipped |
| `console-docs` | console package is not shipped |
| `docs-check-fixtures` | core product roadmap |
| `evidence-sources` | console build, package sources and recorded evidence editions |
| `feedback-evidence` | core feedback evidence edition |
| `github-body` | core outward-vocabulary control data |
| `harness-evidence` | package sources, historical harness baseline and live evidence |
| `harness-fixtures` | Entropy Reducer baseline history and package sources |
| `harness-probe` | core security, budget and discovery records plus package sources |
| `kernel` | kernel package source audits and package README |
| `kernel-docs` | kernel recorded product evidence and documentation |
| `launchpad` | package TypeScript and build configuration needed to export |
| `launchpad-docs` | package TypeScript and build configuration needed to export |
| `launchpad-planning` | package TypeScript and build configuration needed to export |
| `license-fixtures` | docs/LEGAL.md and core license fixtures |
| `license-surfaces` | docs/LEGAL.md license pins |
| `lineage-fixtures` | core idea ledger |
| `local-runner-double` | role-qualification oracle reads core verification report WO-052/VER-001 |
| `outward-lint` | core outward-vocabulary control data |
| `plan-refutation` | core reader profiles, planning history, budgets and historical Git objects |
| `process-debt` | historical Git trees, package sources, core budgets and work orders |
| `reader-fixtures` | core historical publication examples and their recorded comparison |
| `release` | core tag-manifest template, TypeScript and release records |
| `release-surfaces` | core release records and docs/LEGAL.md |
| `resume` | core legacy lifecycle and timing observations WO-030 |
| `runner-fixtures` | package sources, core build inventory and license pins |
| `skeleton` | skeleton package source audits |
| `skeleton-docs` | skeleton recorded product evidence and documentation |
| `target-publish` | core outward-vocabulary control data |
| `verification-evidence` | package sources and core verification evidence edition |
| `vertical` | core outward-vocabulary control data |
| `wo107-schema` | historical corpus observations, collector and Git objects |
| `worktree` | docs/LEGAL.md and core release inputs |
| `worktree-integration` | console package, core source and publication inputs |

The compiled kernel, compiler and skeleton tests travel in the kit. Their
combined package rows also contain source audits or checks of core's
recorded product evidence, so those complete rows remain core-only as listed
above. The excluded `scripts/fixtures/wo138-local-role-qualification.json`
is derived from core's WO-052 verification report and does not travel.

Lifecycle commands run on the carried runtime, including Codex dispatches
that reserve a writer. `node scripts/harness.mjs check` and `emit` verify and
regenerate the bundle. `npm run build` and the build-first `npm run harness`
need the omitted TypeScript source. Console fixtures and browser evidence
need their uncarried packages. Planning commands run here (§Planning in this
instance) with these limits: `npm run plan -- conditions` reports its
console-dependent collection as unavailable, a live refutation or entropy
review is run by this instance's operator rather than by any fixture, and
`npm run release -- check-surfaces --local` still reads `docs/LEGAL.md`, which
the kit does not seed, once an order carries a version (`release-surfaces` in
the table above). `UPSTREAM.md` names the core commit to inspect for each of
these limits.

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
`scripts/kit/` among them, excluding the core-report qualification fixture),
`packages/beacons/**`, the compiled runtime and tests
`packages/<name>/dist/{src,test}/**` with their `package.json` for kernel,
compiler and skeleton, the data and executable doubles under
`packages/kernel/test/fixtures/`, `packages/compiler/fixtures/` and
`packages/skeleton/fixtures/`, the identity corpus test, its two helpers, manifest and synthetic ID vectors
under `corpus/`, and the three mutation self-test modules under
`corpus/mutation/`,
`.prettierignore`, `.prettierrc.json`, the build-free modules under
`packages/*/src/*.mjs`, the harness
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

**Your orders live here.** `docs/work-orders/` holds the orders this
instance cuts, `docs/evidence/`, `docs/verifications/` and
`docs/final-reviews/` their records, and `docs/planning/` the passes that
cut them. The first planning pass is this instance's own: `npm run plan --
start <slug>` cuts its orders from its own sequence; the pre-drafted WO-001
is the only order the kit seeds, and no order of core's ever arrives in an
update. §Planning in this instance names the commands a planning pass runs
here and the seeds it reads.

## Taking upstream updates

Preview before every update. From a clean DotLn core checkout at the commit
you want to take, with its pinned dependencies installed, run:

```sh
node scripts/launchpad.mjs export --update /absolute/path/to/starter --preview
node scripts/launchpad.mjs export --update /absolute/path/to/starter
```

The preview and update share one plan. Each kit path is listed as `replace`,
`add`, `remove`, or `refused`. A refusal names the local edit or instance-owned
collision and the prior manifest hash retained (none for a collision).
`replace` includes files whose bytes already match. The preview also names
the incoming core commit and tag, the declared runtime build snapshot before
and after, and the sibling receipt path it would write, or why no receipt
applies. A declared build hash identifies the harness snapshot; it does not
verify a locally edited runtime. An unreadable local snapshot is `unknown`.
The receipt filename is reserved only by the actual update, so its timestamp
can differ from an earlier preview.

A preview writes nothing to the destination, its pending manifest, core's
sibling receipts or core's sibling registry. It is not a receipt and does not
advance the registry. The from-core form still builds core's pinned runtime
to compute the incoming kit. Review the plan before running the update; run
the preview again if either input changed.

The destination must already contain a valid `KIT-MANIFEST.json`. Missing,
unreadable or nonregular still-carried kit files refuse the operation by
path; an absent dropped file can stay absent. Update replaces files that
still match their prior hashes, adds new kit files and removes dropped files
only when unchanged. Locally edited files are refused and keep their prior
manifest hashes, including dropped files, so a repeat update refuses them
again. A new kit path occupied by an instance file is also refused and stays
outside the manifest. Resolve these files by hand and review the update
before committing it.

**Editing a kit file is choosing the true-fork path.** While its bytes differ
from both its prior manifest hash and the incoming kit, every update lists
that file as refused and keeps its prior manifest hash; nothing merges core's
change into it. If your bytes already equal the incoming kit, the update keeps
them and records the incoming hash. `node scripts/launchpad.mjs verify`
reports other kit files as differing from the manifest while the gates run
on your bytes; a changed file under `packages/<name>/dist/` instead refuses
verification by path. To return, restore the file to the manifest's bytes
before the next update, or keep the fork and take nothing more for that file.
Instance files are yours and are outside the kit-file refusal list;
explicitly opted-in instance actions have their own checks below.

Inside an instance, fetch the starter remote and preview the revision you
intend to merge (this example uses a remote named `upstream`):

```sh
git fetch upstream
node scripts/launchpad.mjs preview --from upstream/main
git merge upstream/main
node scripts/harness.mjs emit
```

This preview reads the incoming kit manifest, actions and harness snapshot
metadata from the selected Git revision; it neither builds nor merges. It
shows the same plan shape against this instance's current files. `replace`,
`add` and `remove` identify byte changes against the incoming manifest;
`unchanged` identifies paths already matching it, including an already-absent
removal. These paths are counted separately, so an identical revision reports
zero replacements, additions and removals. Locally modified kit paths and
occupied new kit paths are flagged for review. A locally modified refusal
whose incoming manifest hash equals its prior hash says `unchanged upstream;
no merge conflict expected`. These are conservative manifest comparisons,
not a prediction of Git's exact merge conflicts: Git can merge some edits,
and a starter's own edits can differ from its retained manifest hashes.
Files outside the manifests are outside the preview, including instance
files a Git merge might change.
Declared instance actions are assessed as manual work after the merge;
`apply` on an action-plan row is hypothetical and performs nothing. An action
that cannot fit this instance is listed as `cannot apply` with its reason;
the kit rows and every other declared action still print. A failed hypothetical
action does not alter the assessment of later actions. Core previews with
`--apply` and actual updates instead refuse on an incompatible action before
any destination write. Neither
a merge nor this preview automatically applies instance actions or writes a
core sibling receipt. A missing or malformed current/incoming manifest
refuses the preview.

The manifest records the new source commit; refused files can still come
from an older revision. `UPSTREAM.md` takes the new provenance when it is
unmodified. The export's original license posture is retained. After a
from-core update, also run inside its destination:

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
`--apply` without the configuration opt-in refuses before writing. Add
`--preview` to that same command first: it lists which actions would apply
or preserve an existing value, with all writes disabled. Without `--apply`,
the core preview lists every action as preserved/no opt-in.

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
commit. The compiled runtime and tests are this project's own output under the same
terms; the export bundles no third-party file, and `npm ci` installs the
pinned development dependencies from the registry or a local cache.
