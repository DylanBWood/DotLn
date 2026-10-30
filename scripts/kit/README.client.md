# DotLn launchpad

This repository is a launchpad instance exported from DotLn core: the control
plane under `scripts/` with its suites, the compiled runtime of
`@dotln/kernel`, `@dotln/compiler`, `@dotln/skeleton` and `@dotln/console` under
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
  `revocationConditions` add restrictions. A narrowing that excludes an
  effect a grant restores, including the kit's own temporary-write grants,
  refuses naming the effect and the grant, so a narrowing keeps those
  effects (an empty `allowedEffects` refuses) and only an overlay grant can
  be removed to resolve it. A revocation condition has
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

The gate runner needs host access beyond the checkout: the shared Git metadata
for linked worktrees, sibling worktree destinations, the ignored local control
and `.runtime/` directories, and its private host coordination directory. On
macOS that directory is `dotln-host-v1-<uid>` under the path returned by
`getconf DARWIN_USER_TEMP_DIR`; on other supported hosts it is under `/tmp`.
The runner must compile and execute its native helpers and acquire kernel
locks there. `TMPDIR` does not relocate this shared coordination directory.
A user-level Claude Code sandbox can prevent those operations or the nested
confinement probe. Run with an operator-approved sandbox policy that admits
these paths and operations, or outside that user-level sandbox. Check the
settings actually loaded; project settings do not establish the effective
user-level posture. Record it in the root `AI-HARNESS-SECURITY.md`.

Preserve any failure's stderr before changing settings. `inForce: false` is the confinement probe's observation;
confirm lock acquisition and release separately. The kit does not change
operator sandbox settings.

1. The export is already a Git repository on `main` with no commit: review the
   files and commit them before any control-plane command. The control plane
   records checkpoints as Git refs and needs at least one commit. An export
   made inside another repository's work tree is an embedded repository there.
   If `docs/lineage/README.md` is absent, as in a fork of a starter exported
   by an older release even after a starter refresh, run
   `node scripts/lineage.mjs index` and commit the generated index with the
   fork's setup commit, before its first `npm run test:docs`.
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
   one term per line as `[refuse: | review: ]term`; the directory is ignored
   by Git. A `refuse:` term refuses every outward artifact that carries it;
   an unmarked or `review:` term is a review item of a target publication,
   read and confirmed by the reviewer; only those two words before a colon
   are markers, so a term holding a colon stays a term, and a marker with no
   term after it refuses naming the line. A present list with no terms is
   `present` with a count of zero and refuses nothing; an absent list is
   `unavailable` and refuses publication. `npm run terms -- check <paths>`
   prints `local-terms list: present` or `unavailable`, and in committed text
   refuses a match of either mode by file, line and mode without printing the
   term. Target publication also needs the instance's own
   `docs/control/outward-vocabulary.json`, whose `reviewTerms` (an array of
   words, possibly empty; the older `terms` key is read as the same list for
   one kit release, with an advisory) are review items too, and an
   operator grant naming the registered repository in
   `packages/skeleton/loadouts/grants.json`; the kit carries neither an
   instance vocabulary nor such a grant. An instance order's executor commits
   both on the operator's stated values, retaining that word and its SHA-256
   in ignored intake, and writes the ignored local-terms list from the terms
   the operator states. The operator merges that authority change first:
   session publication reads the grant registry and registered profile from
   main's committed bytes, never from the publishing order's branch.
   Both files land on the registration order's branch before they reach
   `main`. `npm run worktree -- clone <id> <absolute-path>` records the
   repository's clone into the main checkout's ignored clone map and accepts
   an id that the running checkout's own configuration or siblings
   declaration declares, so the registration order records its clone before
   the merge; `worktree start` for a later target order reads the merged
   registration from `main`. That order's **Preflight:** line names only
   suites this instance runs, such as `npm test -- --only authority-grants`;
   the table under §What runs here lists the core-only rows (`outward-lint`
   among them) that an instance order never names, and the publication
   commands apply the instance vocabulary and the local-terms list to the
   outward body themselves.
   The publish applies three checks to the branch, the commits, the title and
   the composed body (the reviewed prose, the generated Change table and the
   target checks): launchpad identifiers (`WO-NNN`, `WO-NNN-DNNN`, `FUP-<16
   hex>`, `VER-NNN`, `FINAL-NNN`, `REVIEW-NNN`, `WS-NNN`) and `refuse:` terms
   refuse, naming the line, the part of the body and, in a Change row, the
   added path; review words and review-mode terms are listed the same way and
   the publish refuses until the reviewer, having read them, passes
   `--confirm-terms sha256:<digest>` with the digest the refusal printed; a
   Change row of a path the target's base already held is not reported. The
   path and other matched text on every row of a private match stay redacted
   in diagnostics. A match spanning rows retains its full line range and
   cannot use an existing-path exemption for only its starting row. Diagnostics
   still name the rule, starting line, section and private mode. The
   confirmation is recorded in the publication log and the session journal.
   The session form is `node scripts/worktree.mjs publish
   WO-NNN --target-worktree --branch <type>/<slug> --title <title> --body-file
   <committed-reviewed-body-path> [--confirm-terms sha256:<digest>]` from the
   launchpad root. The hook withholds
   the `npm run worktree -- publish` form, naming the admitted node spelling.
   Its opt-in `--draft` form at `verified`
   pushes the target's working tree under a draft pull request that the final
   publish reuses, and this instance's order names the actor and the phrase
   for it (core declares neither). Trust for the target's publication commands
   comes from the registration and the kit: the generated hook admits only
   the node spelling of the publish helper for the recorded target worktree,
   under the merged registration, clone map and authority grant at the
   phases the lifecycle makes them legal. `worktree start` prints sessions
   starting in the launchpad for Codex (`codex --add-dir <target>`), Copilot
   (`copilot --allow-tool …`) and Claude Code (`claude`, then `resume: next`).
   Claude's executor-only `target-worktree` grant reads the current order's
   unique local target registration on each judged write, requires this
   physical launchpad binding and phase `active` or `repairing`, and admits
   the registered target. Copilot uses the same hook; host deny and ask
   rules still apply. The `Next (run manually)` block also starts Codex in
   the launchpad with `--add-dir`; starting inside the target selects its
   separate worker bundle. A registration's
   `hostRules: "literal"` writes that order's exact rules to the main
   checkout's untracked `.claude/settings.local.json` and `.codex/rules/`
   until release close removes them (`node scripts/harness.mjs check` names a
   stale one). While the host's auto-mode classifier remains unqualified,
   use the registration's `hostRules: "literal"` route; it writes these
   order-specific local rules at start and removes them at release close.
   Declare the class's or registration's `disposable` paths for the
   regenerable build output the close deletes, never moves to scratch, and
   `baseDisposablePolicy: "judge-only"` when the base checkout must retain that
   output while keeping its material checks (the default is `"delete"`). Use
   `release: { "policy": "declared", "displayName": "My product" }` with the
   order's `**Target release classification:**` header for a tagged target
   release. The optional name defaults to the registration id and changes the
   Release title and tag message, never the tag name or an existing Release; turn on the forge's
   delete-branch-on-merge setting for the target, since the kit deletes no
   remote branch.
5. Copy `dotln.config.example.json` to `dotln.config.json` only when this
   instance moves a document root; an absent file means the default layout
   under `docs/`. The example declares only the `docs` base, from which every
   other root derives; a root declared on its own stays where it is declared
   when the base moves. A registered repository declares its own `gate`
   (named argv commands with timeouts and plain/review selections) and optional
   `documentationRoot` (default `docs`); a target order runs that gate and
   keeps its order, decisions and reports under that root's launchpad layout.
6. Tell this instance's own session: **Start WO-001 in its own worktree.**
   The session starts from clean `main` whose export/setup commit is on
   `origin/main`, with the pre-drafted order carrying first release `v0.1.0`:
   `npm run worktree -- start WO-001 docs/work-orders/WO-001-environment-truth.md`.
   The command creates the sibling worktree on `wo-001`, activates the order
   there and prepares its runtime. The session started in `main` writes no
   other file in that worktree: the harness refuses its writes outside its
   own checkout, so the worktree's files belong to the session opened there.
7. Open a session in that `wo-001` worktree. `worktree start` carried the
   main checkout's ignored local-terms list into it when one was registered
   there (step 4); otherwise the session registers its own from the terms
   the operator states. It runs `npm run resume -- status` (`--json` is the
   canonical record). It runs `npm run meta` to generate the decision index
   from this instance's own records before its first gate, and again whenever
   its decisions change. The export seeds the lineage index; for an older
   export, step 1 or the update branch of §Taking upstream updates generates
   and commits it, and bootstrap never writes it. Run
   `node scripts/lineage.mjs index` after editing the ledger. Then enter
   `resume: next`. The session reads the operating contract (`CLAUDE.md`,
   symlinked as `AGENTS.md`); its generated harness block routes each resume
   phrase to the role skill under `.claude/skills/` or `.agents/skills/`, and
   the generated hooks enforce the compiled refusals where the harness runs
   them. The operator merges each pull request with a merge commit: release
   close requires the order's branch in `origin/main`'s history, which a
   squash or rebase merge rewrites.

If an older instance already activated WO-001 on `main`, tell **that instance's
own session**: **Update from the refreshed starter and recover WO-001 into its
own worktree by the refreshed starter's README, preserving its verified work
and records.** This instruction authorizes the session to perform the update
and recovery. The operator types phrases and merges pull requests; the session
performs the Git commands. The phrase names the refreshed starter's README
because an instance exported before this procedure holds an older copy; its
session reads this section from the refreshed starter, for example `git show
upstream/main:README.md`.

The session in `main` first stops competing writers, preserves ignored intake
in the original checkout, and previews the starter revision as §Taking upstream
updates shows, stopping for the operator on any refused kit path. If `git
status --porcelain --untracked-files=all` then lists an untracked lineage
index (`docs/lineage/README.md` under the default documentation root), the
session deletes that file before the stash: it is the generated index an
older README had the instance write on `main`, the update branch regenerates
and commits it, and the stash could not restore it over that committed copy.
The session saves tracked and non-ignored untracked
work in a named `git stash push
--include-untracked -m 'WO-001 main recovery'`, records the exact stash hash
and keeps that ref throughout recovery. A clean original checkout creates no
stash. It takes the update through the update pull request that section
describes. Once the operator has merged it, the session fast-forwards `main`
(`git fetch origin` and `git merge --ff-only origin/main`), creates a sibling
`wo-001` worktree from that `main` (`git worktree add -b wo-001 <sibling
path> main`) and applies the saved stash there (`git -C <worktree> stash
apply <stash hash>`), then reads `npm run resume -- status` in that restored
worktree to confirm the preserved phase. Existing
branches, directories, divergence or
conflicts require inspection and preservation, never overwrite or a forced
update.

The operator then opens a session in `wo-001`. That session runs `node
scripts/bootstrap.mjs`, registers its own ignored local-terms list and runs
`npm run meta` as in step 7, and checks `npm run resume -- status` and the preserved control
segment, handoff, decisions and verification records. It continues the
recorded phase without activating WO-001 again or repeating a completed
verification. Release preparation and final review run in `wo-001`. Because
`wo-001` starts from the fork's merged `main`, its pull request carries only
WO-001's own commits.

## Planning in this instance

The same planning commands run here using this instance's records. Commit the
export and install its pinned dependencies first. On clean `main`, run
`npm run plan -- start first-pass`; it creates the planning branch and reads
the current follow-up feed. Draft this instance's orders and sequence, then
record its dated planning pass in `docs/lineage/idea-ledger.md`. `plan start`
also writes the pass's planning document with its standard section headings.

- `npm run plan -- followups` pages the register; `--export <file>` exports it;
  `--apply <batch.json>` applies dispositions against the revision read.
  `npm run plan -- followups --sync` reconciles changed public sources.
- `npm run plan -- failures` and `npm run plan -- conditions` report local
  evidence. Core condition sources absent here are named and have unknown
  verdicts; the console collector reports the availability of each source.
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
  the former reports that release surfaces are unavailable. With an order,
  it checks the instance's release declaration and license surfaces as described
  below; a target order records no release. These reads do not publish anything.

Export writes these instance-owned seeds once; ordinary kit updates leave their bytes alone:
`docs/planning/sequence.md`, `docs/planning/followups.json` (empty schema-1
register), `docs/control/doc-ceilings.json` (no documents),
`docs/control/doc-baseline.json` (empty editorial baseline),
`docs/control/budgets.json` (kit defaults, no acceptances), and
`docs/lineage/idea-ledger.md` (header and status vocabulary only). None is
manifest-listed. The initial lineage index is seeded; its command regenerates
it after ledger edits. Decision and work-order indexes are generated by their commands. Core's register, ledger, editions and score history
are not copied.

Release close refreshes the declared starter's template seeds as well as its
kit files. Each replaced seed must still match a proven prior export; a custom
edit, missing path or changed file type refuses by path and pushes nothing
when that seed's template changed. Unchanged templates leave a customized
working copy intact; a `CLAUDE.md` or `.gitignore` copy the refresh could not
use (missing, not a regular file, or without its hand-written floor) refuses
by path with the remedy before any write. Preserve an affected customization
and restore its
prior exported template through a reviewed change before retrying.
The refresh result lists the rewritten seeds. Forks receive those starter
commits through their own session's update on the operator's word; their
control records and instance work are preserved through that update.

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
`npm run reader -- profile <surface>` still supplies the balanced default
when no profile is declared. It creates no editorial records and links an
example only when examples are present. A malformed declared profile remains
an error; publication guidance reports it without rewriting the text.

The refutation goal standard contains the execution guide's marked
`dotln-goal-rules` blocks and this instance's purpose, or an explicit
unavailable observation. It does not import core's purpose or critical-path
sentence into that standard. Declare the purpose in a contained regular
`docs/product/purpose.md` with exactly one nonempty block between
`<!-- dotln-purpose:start -->` and `<!-- dotln-purpose:end -->`; the kit seeds
no purpose. Missing or malformed rule markers and malformed declared purposes
refuse instead of substituting core's goals. Other planning inputs remain
separately visible, including an absent critical-path declaration.

A target-scoped planning pass uses `npm run plan -- target-publish
<repository-id> --base <commit> --from <directory> --branch docs/<slug>
--title <title> --body-file <path>`. It publishes only the directory's
`product/` and `planning/` files under the target's documentation root, from
the target commit the planner read, under the registered profile and operator
grant. It prints repository, commit and path links to keep in the instance's
planning document; refutation still judges the instance's subject.

## Releases in this instance

An instance with orders completed before its control log can declare their
IDs in `historicalWorkOrders` in `dotln.config.json`. The default is an empty
list. This affects the historical index and dependency validation; it does
not invent control closure or inherit core's order IDs.

For an operator-authorized scope change, `npm run plan -- amend-order`
binds only an order in the latest judged planning horizon. The never-judged
seed WO-001 has no receipt to amend: record the actual authorization and
bounded scope in its structured decisions and run the ordinary planning,
document and lifecycle checks. This supplies no additional authority,
planning verdict or hold disposition. A required missing planning receipt
still needs normal planning/refutation; do not create a fictitious pass to
enable amendment.

<!-- DOTLN-RELEASE-BEGIN -->
This source prepares DotLn-Enterprise-Starter `v0.1.0`.
<!-- DOTLN-RELEASE-END -->

Release surfaces check this block, component versions and workspace pins,
the PR and release-notes body profile, license files and package publication
guards. `docs/LEGAL.md`'s three pins are checked only where this instance
actually declares that file; absence reports unavailable for those pins alone.
Set `release.displayName` in this instance's `dotln.config.json` to choose
its release name, then run `npm run release -- prepare --local` to refresh
the version claim. Fresh exports use `DotLn-Enterprise-Starter`; absent
configuration preserves the historical `DotLn` default. The name must be
nonempty, trimmed and single-line, without control characters, backticks or
release version tokens. Updates preserve this instance-owned configuration.
Each release retains the name configured at its release commit; changing
the name affects future releases, not older tags or Releases.
The seeded WO-001 carries `v0.1.0`; `npm run release -- prepare --local`
assigns later versions above this instance's own tags. A target order's
launchpad records branch records no release, keeps one well-formed release
claim at least as new as the latest release, and carries links to the records
committed in the target. It needs no release-notes file; `release prepare
--local` reports no release and changes no files for that target order.

For an unmodified older export missing the block, first-order version or
release classification, the instance's own session updates from the refreshed
starter on the operator's word using the recovery above. The starter supplies
the release block, `(v0.1.0)` heading and `Release classification: minor`.
If the instance customized those seeds, its session preserves the edits and
resolves the update against the operator's instruction, recording the chosen
values in the order's decisions before release preparation.

## What runs here, and what does not

After the first steps above, `npm test`, `npm run test:docs` and
`npm test -- --review` run inside this instance without package source. Each
selection first runs the six structural checks: formatting, configuration,
registrations, declarations, generated artifacts and host memory pressure.
The generated check includes the runtime manifest, active pinned snapshot
and harness bundle;
`npm run sync` repairs stale derived artifacts. Then `kit-verify` runs instead
of `build`. It hashes every
manifest-listed compiled runtime and test file, and refuses a changed,
missing or nonregular compiled file by path before the selected suites. Other
kit-file changes produce one advisory line. Run
`node scripts/launchpad.mjs verify` directly for the manifest check.

A long gate wall time with short task durations can be host-lane waiting:
the summary attributes its wait by checkout relation, and
`node scripts/harness.mjs lanes` reads the live holders and recorded capacity.

The instance coordinates work in registered sibling repositories. Its
ordinary `npm test` and review check the installed DotLn runtime; they do
not test a sibling's implementation. `node scripts/target-gate.mjs WO-NNN
[--review]` runs that repository's declared checks in its target worktree
and binds the result to its current bytes. `npm run test:docs` separately
checks the instance's coordination records. Each order still needs its
declared evidence, including the first order's observed harness smoke.

The observed selections in a fresh fixture instance are:

- `npm test`: `format`, `configuration-root`, `registrations`, `declarations`, `generated`, `host`, `kit-verify`.
- `npm run test:docs`: `format`, `configuration-root`, `registrations`, `declarations`, `generated`, `host`, `kit-verify`, `license-surfaces`, `docs-check`, `harness-context`, `plan-refutation-current`, `plan`, `reader-profiles`, `entropy`.
- `npm test -- --review`: `format`, `configuration-root`, `registrations`, `declarations`, `generated`, `host`, `kit-verify`.

These checks run fresh: the active snapshot and coordination records can
change without changing code identity. A missing upstream comparison ref
or an upstream kit update does not expand the selection into platform
regression.

Each of these selections is a document-kind gate run, because the harness
check reads the harness surfaces: while it runs, writes to the active
order's own evidence, verification and final-review directories are
refused. Write that evidence before the gate or after it passes. Core development still runs its product and changed-machinery
suites. An instance that intentionally changes carried machinery needs
order-specific evidence and can request a carried fixture with
`npm test -- --only <suite>` or machinery diagnostics with
`npm run test:machinery`.

These suite rows stay core-only. Explicit diagnostic selections, including
their `--list` form, print each unavailable name and reason. Shipped fixture
rows are available only when deliberately requested; these declarations do
not change core's gate. An explicit
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
| `console` | console fixtures and recorded product evidence |
| `console-docs` | console fixtures and recorded product evidence |
| `docs-check-fixtures` | core product roadmap |
| `evidence-sources` | package sources and recorded evidence editions |
| `feedback-evidence` | core feedback evidence edition |
| `github-body` | core outward-vocabulary control data |
| `harness-evidence` | package sources, historical harness baseline and live evidence |
| `harness-fixtures` | Entropy Reducer baseline history and package sources |
| `harness-probe` | core security, budget and discovery records plus package sources |
| `instance-history` | committed instance history and package sources needed to export |
| `kernel` | kernel package source audits and package README |
| `kernel-docs` | kernel recorded product evidence and documentation |
| `launchpad` | package TypeScript and build configuration needed to export |
| `launchpad-docs` | package TypeScript and build configuration needed to export |
| `launchpad-planning` | package TypeScript and build configuration needed to export |
| `license-fixtures` | docs/LEGAL.md and core license fixtures |
| `lineage-fixtures` | core idea ledger |
| `local-runner-double` | role-qualification oracle reads core verification report WO-052/VER-001 |
| `outward-lint` | core outward-vocabulary control data |
| `plan-refutation` | core reader profiles, planning history, budgets and historical Git objects |
| `process-debt` | historical Git trees, package sources, core budgets and work orders |
| `reader-fixtures` | core historical publication examples and their recorded comparison |
| `release` | core TypeScript and release records |
| `resume` | core legacy lifecycle and timing observations WO-030 |
| `runner-fixtures` | package sources, core build inventory and license pins |
| `skeleton` | skeleton package source audits |
| `skeleton-docs` | skeleton recorded product evidence and documentation |
| `sync-fixtures` | the core generated-artifact and evidence-edition inventory |
| `target-publish` | core outward-vocabulary control data |
| `verification-evidence` | package sources and core verification evidence edition |
| `vertical` | core outward-vocabulary control data |
| `wo107-schema` | historical corpus observations, collector and Git objects |
| `workstream-pilot` | package TypeScript and build configuration needed to export |
| `worktree` | docs/LEGAL.md and core release inputs |
| `worktree-integration` | core source and publication inputs |

The compiled kernel, compiler, skeleton and console tests travel in the kit. Their
combined package rows also contain source audits or checks of core's
recorded product evidence, so those complete rows remain core-only as listed
above. The excluded `scripts/fixtures/wo138-local-role-qualification.json`
is derived from core's WO-052 verification report and does not travel.

Lifecycle commands run on the carried runtime, including Codex dispatches
that reserve a writer. `node scripts/harness.mjs check` and `emit` verify and
regenerate the bundle. `npm run harness -- check` restores the carried runtime
before checking it. `npm run build` in a kit reports
`carried runtime is the build; nothing to compile` and writes nothing.
The build-first `npm run console`, `npm run dotln` and `npm run skeleton`
commands therefore run the carried runtime. Open the shipped console with
`npm run console -- live --store .runtime/resident` or read its board with
`npm run console -- board --json`. The kit carries both contracts at
`packages/console/uifa-board-v1.schema.json` and
`packages/console/runtime-status-v1.schema.json`.
The status view labels resident-owned continuation steps as logical
`vertical-host` episodes and displays intent decision holds. Those rows do not
claim a native model launch; the child stores retain native-worker evidence.
The episode links to its filed intent; the work-order list separately shows
the allocated derived order. A continuation whose last step settled terminally
leaves the actor list; one that ended awaiting a decision keeps its hold.
Hold reason codes omit private raw diagnostics.
Console fixture suites need core fixture data and recorded product evidence;
browser evidence needs its uncarried package. Planning commands run here
(§Planning in this instance) with these limits: a live refutation or entropy
review is run by this instance's operator rather than by any fixture.
`npm run release -- check-surfaces --local` judges the instance's release
surfaces. The `docs/LEGAL.md` pin rule reports unavailable when that file is
absent; a declared file must pass its normal validation. `UPSTREAM.md` names
the core commit to inspect for the carried runtime.

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
compiler, skeleton and console, the data and executable doubles under
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
settings belong in the ignored `.claude/settings.local.json`, where the
literal host-rule fallback also writes and removes one target order's rules
(`.codex/rules/dotln-WO-NNN.rules` is its Codex counterpart). An ignored
per-order sidecar under the configured control root's `local/host-rules/`
records Claude rule ownership and the Codex file hash so removal preserves
pre-existing rules and refuses an edited owned Codex file. The single rule
prefix names the absolute node helper and order; raw Git, gh and npm receive
no generated prefix. A later identical operator occurrence is preserved;
removing and re-adding an indistinguishable sole occurrence cannot be inferred.
Rewriting rules requires the committed literal opt-in and matching target
registration; removal remains available after opting out. The work-order
README is generated rather than seeded: `docs/work-orders/` gets the index at
the first lifecycle transition (`activate`). The export seeds the lineage
index at `docs/lineage/README.md`; `node scripts/lineage.mjs index`
regenerates it after ledger edits and generates it for an older export, in
step 1 or on the update branch, and bootstrap never writes it.

The optional committed `contributions.operatorAuthor` is one public
`Name <email>` author identity exempt from contributor sign-off. Omission gives
no author an exemption. The kit supplies no identity, and local Git identity
configuration never grants one; changing this declaration is a reviewed instance
decision. Historical order IDs come from this instance's `historicalWorkOrders`
declaration.

**Your orders live here.** `docs/work-orders/` holds the orders this
instance cuts, `docs/evidence/`, `docs/verifications/` and
`docs/final-reviews/` their records, and `docs/planning/` the passes that
cut them. The first planning pass is this instance's own: `npm run plan --
start <slug>` cuts its orders from its own sequence; the pre-drafted WO-001
is the only order the kit seeds, and no order of core's ever arrives in an
update. §Planning in this instance names the commands a planning pass runs
here and the seeds it reads.

## Taking upstream updates

A release close runs its printed `--publish` command once; `--dry-run` is
optional when a prerequisite is in doubt. Before importing built modules, the
close entry prepares the verified carried runtime in a child process (core
builds its source runtime in a child). This keeps the compiler predicting a
starter update aligned with the exported runtime's own emit. Publication and
retry controls remain the same.

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

Inside an instance, its own session takes a starter update on the operator's
word. It previews the revision with that revision's own launchpad, run from a
temporary detached worktree under the ignored `.runtime/` directory. The
instance's launchpad knows only the kit paths of its export and refuses a
manifest naming a later one; the incoming launchpad knows every path it
ships. This example names the starter remote `upstream`:

```sh
git config remote.upstream.tagOpt --no-tags
git fetch --no-tags upstream
git worktree add --detach .runtime/upstream-preview upstream/main
node .runtime/upstream-preview/scripts/launchpad.mjs preview --from upstream/main
git worktree remove .runtime/upstream-preview
```

Set `remote.upstream.tagOpt` once so later ordinary fetches also omit tags.
An explicit `git fetch upstream --tags` overrides `remote.upstream.tagOpt
--no-tags`; fetch plain unless you intend to bring in all starter tags. To
select one starter tag without adding it to the instance's tags, use the
ref-specific example below.
Starter tags identify the starter's export, not this instance's release baseline;
the local release commands exclude annotated tags with the starter's recorded
message. To preview a named starter release, fetch it into a non-tag ref and
use that ref for both the detached worktree and the preview revision:

```sh
git fetch --no-tags upstream refs/tags/v0.85.0:refs/upstream-releases/v0.85.0
git worktree add --detach .runtime/upstream-preview refs/upstream-releases/v0.85.0
node .runtime/upstream-preview/scripts/launchpad.mjs preview --from refs/upstream-releases/v0.85.0
git worktree remove .runtime/upstream-preview
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

The update reaches the instance's `main` through its own update pull request,
so a later order's pull request carries only that order's commits. From clean
`main`, the session creates a branch (for example `chore/starter-update`),
merges the previewed revision into it (a fast-forward when `main` has no
commits of its own), runs `node
scripts/harness.mjs emit` and `node scripts/lineage.mjs index`, and commits
the regenerated bytes on that update branch. This includes a lineage index
missing from an older export. It pushes the
branch to `origin` and opens a pull request against `main`, which the operator
reviews and merges with a merge commit, so `main` keeps the starter's history
and the next update does not apply this one again. The session then switches
back to clean `main` and runs `node scripts/launchpad.mjs update --finish`.
That command fetches `origin`, checks the fast-forward before changing the
checkout, advances `main` to `origin/main` and runs bootstrap; main stays
ready for the next worktree. It refuses a dirty tree, a non-fast-forward or
a checkout other than `main`, naming the fact.
Bootstrap prepares local dependencies and harness files without generating
the tracked lineage index on main. A `.runtime/upstream-preview` left by an interrupted
preview holds only a detached checkout: the session removes it with `git
worktree remove --force .runtime/upstream-preview`, or `git worktree prune`
when its directory is already gone, before previewing again.

For gates and `npm run sync` after records have moved into a target, the
moved-record readers find the ignored clone mapping in the running launchpad
checkout, then its primary checkout (the common Git directory's owner,
whatever branch it holds), then a worktree on `main`. Keep the mapping in one
of those checkouts; an update's secondary worktree can use the primary
checkout's mapping while that primary checkout holds a planning branch.

The manifest records the new source commit; refused files can still come
from an older revision. `UPSTREAM.md` takes the new provenance when it is
unmodified. The export's original license posture is retained. After a
from-core update, also run inside its destination:

```sh
node scripts/harness.mjs emit
```

Review that re-emit with this instance's configuration and overlay. Updates
flow from core into the starter as a reviewed change, then from the starter
into forks through each fork's update pull request and its re-emit.
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

## Owned cleanup and retention

Release close prunes owned leftovers after its worktree cleanup, scoped to
the closing order's captured roots, main's retained lane and this checkout's
registered temporary roots. It does not walk unrelated system temporary roots.
An explicit `harness prune` and the read-only census `plan start` prints still
walk them, but only `harness prune --apply` removes expired roots outside a
close's scope; the update preview's census is limited to this repository. The close
receipt records candidates, removals, retentions and blockers. Its seven timed
steps cover prerequisites, runtime, worktree removal, publication, starter
refresh, prune and recording; `plan failures` reports the latest eight timed
attempts' median total and slowest step. Retained-material output and removal
receipts use counts by class and digests. `--list-material` supplies paths
outside the admitted close commands, so host permissions decide it;
digest-bound inventory sidecars preserve the full removal proof for retries. A blocker
keeps the same close retry command. Gate completion removes passing fixtures
and retains failed ones for diagnosis, including standalone captures and scratch
owned by those suites. Every gate-owned root is accounted for; live workers,
null retention, reusable caches and independent coordination remain protected.
Repeating completion does not restart the diagnosis window.
Session completion removes only its own
scratch and dead captures after writer release and background work ends. Live
or uncertain owners and another worktree's lanes or writer remain protected.
An ordinary Claude Stop ends a turn; scratch survives until the session or its
dispatch has an observed end. Physical ownership markers are excluded from
fixture copies and seed commits. Invalid nested metadata retains the tree and
reports a cleanup blocker.
Global apply shares the host lane lock; no daemon or host-memory exception is
installed. `worktree start` creates the worktree without running a prune census;
`plan start` and update preview print the census.
Nested suite commands retain their outer gate's cleanup ownership across copied
repositories. Creator teardown waits only for a gate that can read its ledger.

Every role's `dispatches` entry in `docs/control/budgets.json` carries
`wallClockMs` and `completeRuns`; missing keys and null disable that bound.
`dispatches.executor.repair` overrides the executor's bounds for `resume: fix`.
The kit exports `local-median` for implementation, verification, final review
and repair. Each consumer derives max(4 times its own completed phase median,
8 h 0 min); without local history the bound is 8 h 0 min. History is cut off at
the dispatch's original start. No source-repository timing sample is exported.
Explicit numeric overrides and null retain their meanings; the complete-run
default is three. Planner, refuter and release close stay unset. This instance
owns its budgets.
The gate host task, bounded wrapper and lifecycle redispatch refuse exhausted
bounds. Claude's tool hook also refuses costly starts and worker launches,
and its Stop hook prints standing. `node scripts/harness.mjs usage <session>`
returns the same standing on all hosts. If standing cannot be read, usage still
prints its observation and host session readback with
`dispatch standing: unavailable (<named read error>)`. Restored history recovers
the original phase attempt's anchor even after completion. Host-refused complete
selections consume no run; admitted failures and interruptions do. Reads, listings and focused
reproductions stay available. Use `analysis:` for diagnosis. When the operator
authorizes proceeding in ordinary language, interpret the conversation context,
capture the actual words and context in ignored intake, and run
`npm run resume -- accept-overrun <wallClockMs|completeRuns>
--ceiling <value> --reason <text> --capture <path> --capture-hash sha256:<digest>
<actor-flags>` yourself with your actual actor attestation. The executor can
record that authorization while keeping its writer. No exact phrase, session
exit or manual operator command is required; diagnose and repair script errors
in the same session. Without operator authorization the bound still holds.
An operator may also authorize a run for as long as needed before it begins,
in ordinary language. Record `--ceiling unlimited` for both `wallClockMs` and
`completeRuns` with that capture. Null acceptance ceilings lift those two
limits until the current phase completes; they preserve timing and run counts.
The extension applies
only to the current order activation and phase, changes no verdict, and is
projected by `status --json`. The meter and `plan failures` show stops,
acceptances and the next same-order event with its delay. Operator-facing
durations use hours and minutes; numeric flags and machine records keep their
declared units.

Read before upgrading: the optional `retention` object in
`docs/control/budgets.json` takes hours for `gate-fixture-passed` (0),
`gate-fixture-failed` (24), `session-scratch` (24), `worker-capture` (1),
`warm-fixture` (0 after stale), `legacy-backfill` (48) and `coordination` (null).
Every key admits null, which preserves independently owned roots in that class.
Runtime directories inside gate fixtures share the fixture's lifetime; an
explicit per-root null still protects nested material. Application scratch uses
its own operation cleanup, with fixture ownership as the fallback for leftovers.
A nested cache with recorded fixture ownership also ends with the fixture.
Removing the owning repository does not pin an expired fixture; inaccessible
or invalid observations still retain it. Independent caches and coordination
keep their own protocols.
An older instance without the block reads these defaults and keeps `npm run meta`; no historical
control record or judgment needs editing. Exact helper spelling and host policy
still decide command admission; the kit does not change account settings.
An orphan without an observed end is retained on preview. Applying prune
records the first proven-dead observation and starts its full retention window;
it cannot be deleted by that same plan merely because it was created long ago.

## Document quality

Artifacts follow their declared contract and check, never the preceding
instance's shape. Standing documents describe current state and link dated
records. Writing guidance identifies the contract, meaning the document sections
and functions that judge each surface, then the kind and reader. Preserve
required content and the context, evidence, examples and alternatives that help
that reader understand, answer, decide, act, verify or recover reasoning.
Artifact size is no quality score and no example is selected by its length.

Use `quality pass: <target>` in the current session to improve a document file,
file list, folder, described set, or specific passage. For example,
`quality pass: the opening paragraph of README.md` limits editing to that
passage while allowing wider reading. The assistant resolves and announces the
scope, asks only about material target or reader ambiguity, preserves useful
content and settled structure, and leaves sound passages unchanged. It edits
generated documents through their sources and preserves immutable records.
Existing document checks still apply; it reports changes and unresolved facts,
then continues the original task. The command adds no lifecycle event or gate
and retains writer isolation, live-gate protection and publication controls.
Every generated role carries this guidance. Claude's prompt hook also adds it
when the prompt's own first content line opens with the command, so a prose
mention, a task notification or another agent's report does not invoke it.

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
