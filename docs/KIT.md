# DotLn kit guide

This is the kit guide for the launchpad instance it ships with. The kit is
exported from DotLn core: the control plane under `scripts/` with its suites, the compiled runtime of
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

For example, this overlay reduces writer authority and removes one optional
support; Tinkerer economy is elected in `features.tinkerer-economy`, never in
an overlay:

```json
{
  "version": 1,
  "unequip": ["process-cost"],
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
  `communication-recommendation`, `communication-intent`,
  `process-cost`, `goal-alignment`. Tinkerer economy is not an overlay
  switch: elect it in `features.tinkerer-economy` (§Features), and an
  overlay that names `tinkerer-economy` refuses. An ID cannot appear in
  both arrays; competing communication supports still refuse. These
  switches do not define new units or remove the locked floor.
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

The first command in a new clone is `node scripts/doctor.mjs`, before
anything is installed: it prints one row for each assumption the kit makes
of the host, with what it observed, whether the assumption is met, what
depends on it and the remedy, and it reads and refuses nothing. `--json`
prints the same rows, and `npm run doctor` runs it once the install is done.
A fact it cannot read is a row marked `unknown`, which changes no exit
code: where it cannot read which hosts this instance has on, it says so in
a row and looks for no elected host's CLI, and a tool that is on the path
and does not answer for its version is reported found and unread, not
missing.
Its output holds versions, counts, sizes and yes or no, and never a host
name, a user name, a URL or an absolute path, in whatever script a
directory or an account is named, so it can be pasted into a planning
dispatch from a managed machine. One limit: where a fact reaches the report
as the host gave it and holds a path with a space in one of its names, the
path is withheld up to that space and what follows it is printed, so read a
report before pasting it. Beside the Node and Git floors
below, the kit needs a C compiler, which builds the two small helpers every
gate task starts through (the Command Line Tools or Xcode on macOS, a
compiler that answers to `cc` elsewhere); the forge's tool, the GitHub CLI
`gh`, signed in, for a final review's pull request, a release close and an
update's publish; and, for the instance's own repository, merge commits
allowed, which release close needs of it (a registered target's repository
merges by its team's method; see
[Working as a team on one instance](#working-as-a-team-on-one-instance)).
The kit is exercised on macOS. It is designed for Linux and
WSL2 and has not been exercised on either. Native Windows is unsupported:
run the kit under WSL2 there. An update's preview names each floor of the
incoming release that this host does not meet (see
[Taking upstream updates](#taking-upstream-updates), which cites the
decisions on the report and on the preview).

This kit runs on Node 24.15 or later in the 24 line, or on Node 26:
`engines.node` in `package.json` reads `^24.15.0 || ^26.0.0`. It needs Git
2.31.0 or later: `engines.git` reads `>=2.31.0`. The floor rests on two
forms the scripts use that Git 2.31.0 introduced, `git rev-parse
--path-format` and configuration set through the environment
(`GIT_CONFIG_COUNT` with its key and value pairs); below it they fail with
Git's own words, which name neither the floor nor the version. Each Git form
the kit's scripts and tests name is recorded as confirmed against Git
2.31.0's manual, or as a newer form admitted only in the files that name it
with the reason it is safe there, and core's gate refuses a new form its
static reading of the source finds until someone has confirmed it; arguments
assembled at run time, and the shell constructs the header of
`scripts/lib/git-surface.mjs` names, are outside that reading.
`node scripts/harness.mjs check`,
`harness evidence` and every `npm test` selection refuse another Node or an
older Git, naming the declaration and the version they read; in a selection
the `host` task then runs first and nothing else runs. An instance on an
older Git lowers `engines.git` in its own `package.json`, the one place the
floor is declared, and reports to core what failed there. `node
scripts/bootstrap.mjs` is unaffected, and a target gate runs the
target's own declared checks without judging Node. These checks read only
`^major.minor.patch` alternatives for Node and the one `>=major.minor.patch`
form for Git, so an edited `package.json` that an update left with another
form is refused by name until it reads in this form (see
[What runs here, and what does not](#what-runs-here-and-what-does-not), which
cites the floor's decision).
The kit exports no `.node-version`, so an instance that wants a version manager
to select a runtime pins its own.

The commands an operator types through this instance's whole cycle, for the
kit release in hand, are one generated page, [OPERATOR.md](OPERATOR.md), which
`node scripts/launchpad.mjs commands` prints before any install (see
[Releases in this instance](#releases-in-this-instance), which cites its
decision). The steps below say more about the first of them.

To start a private repository from this starter, clone it with no tags and
keep it as the `upstream` remote that §Taking upstream updates uses:

<!-- operator-commands new-instance: Once per instance, clone the starter into a private repository with the starter kept as `upstream`, then install and check the runtime; the instance runs Claude Code alone, and its first order inspects no other host, until its `dotln.config.json` elects one. -->
```sh
gh repo create <org>/<name> --private
git clone --no-tags <starter url> <name>
cd <name>
node scripts/doctor.mjs
git remote rename origin upstream
git config remote.upstream.tagOpt --no-tags
git remote add origin <private url>
git push -u origin main
node scripts/bootstrap.mjs
node scripts/harness.mjs check
```

`git clone --no-tags --branch main <starter url> <name>` makes the initial
branch explicit and works the same way. The `git config` line is redundant after
`--no-tags`, which the rename carries into `upstream`; it stays because it is
the line §Taking upstream updates gives an existing clone. The clone already
holds the starter's commit, so step 1 below does not apply, and the last two
lines do steps 2 and 3. `harness check` then passes and reports `local-terms
list: unavailable`: the recipe does not replace step 4's local-terms list or
step 7's `npm run meta`, so the numbered steps continue from step 4. With a
registered target, bootstrap names before its preparation steps any target
whose clone mapping none of the launchpad's checkouts records (this one, the
primary checkout, the main worktree), with the registration command, since
the plan check and the document gate refuse until it is recorded.

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
   by an older release and not refreshed since v0.121.0 (whose refresh adds
   every export seed a starter lacks, the lineage index and
   `dotln.config.json` among them; see
   [Kit files and instance files](#kit-files-and-instance-files)), run
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
   one entry a line; the directory is ignored by Git. The list has two
   classes. A `refuse` entry refuses wherever a screen finds it: in committed
   text, a publish, an export, a receipt and an outward artifact, naming the
   file, the line and the mode and never the term. A `context` entry never
   refuses: each screen that finds one prints the file and the line for the
   stage at hand to read, and passes. A mode word alone on a line (`refuse:`
   or `context:`) opens a section whose lines take that mode until the next
   such line. A line that carries its own marker (`refuse: <entry>`) keeps
   that mode, a line outside every section with no marker is context,
   `review:` is read as `context:`, an entry listed in both classes refuses,
   and a `#` at a line's start, or after a space, begins a comment that runs
   to the line's end, on a section line and after an entry too. Only those
   three words before a colon are markers, so an address or a host and port stays the entry it
   was; a marked line with no letter or digit after its marker is malformed,
   and the list then refuses naming that line, never a term. An entry is
   matched as a writer spells it. Its runs of letters and digits are joined
   across spaces, line breaks (with the next line's quotation, comment or list
   marker), hyphens and dashes, periods, underscores, apostrophes, slashes and
   Markdown emphasis or code marks, and across the characters the entry itself
   carries between its runs. They are joined across nothing else, so letters
   on either side of a brace, a bracket, a pipe, a backslash, a quotation mark
   or an operator are never one word.

   The kit ships an example list, `scripts/kit/terms.example.txt`:

   ```text
   # Example local-terms list. Copy it to docs/control/local/terms.txt,
   # which Git ignores, and replace every entry with your own, one a line.
   # A # at a line's start, or after a space, begins a comment: say what each
   # entry names, above it or after it.

   refuse:
   # An internal codename. It must never appear.
   Project Lantern
   # An internal host name.
   build.lantern.example

   context:
   # A product name that is also an ordinary word. A stage reads each match.
   Harbor
   ```

   A branch that adds these four lines as `docs/sample.md`:

   ```text
   The ferry left the harbor at dawn.
   Harbor 2.1 moves the scheduler to its own service.
   Ask the Project-Lantern team for the token.
   m = {a: har}|{bor: b}
   ```

   is answered by `node scripts/terms.mjs branch` with one refusal on standard
   error and a nonzero exit:

   ```text
   FAIL docs/sample.md:3: a local term in refuse mode
   ```

   and, on standard output, with its status line and two lines to read:

   ```text
   local-terms list: present; entries: 2 refuse, 1 context; changed files screened: 1; lines found: 1 refuse, 2 context
   CONTEXT docs/sample.md:1: a local term in context mode
   CONTEXT docs/sample.md:2: a local term in context mode
   ```

   The status line gives the list's state, the entries in each class, the
   files screened and the lines found in each class. Line 3 stops the gate
   until it changes, hyphen or no hyphen. Lines 1 and 2 stop nothing: the
   stage reads both, leaves the ferry's harbor as it is and rewords the line
   that names the product. Line 4 prints nothing, because its letters stand on
   either side of a brace and a pipe. With the `refuse:` line and the
   `context:` line removed from the list, all three entries are context: the
   task prints a `CONTEXT` line for each of lines 1, 2 and 3, prints no `FAIL`
   and exits zero.

   A present list with no entries is `present` with counts of zero and refuses
   nothing; an absent list is `unavailable` and refuses publication. WO-001's
   checklist item 4 registers this list and checks the files that order
   writes; its criterion 3 records the printed status, a refuse-mode match
   fixed before filing and each context-mode match read (see
   [Kit files and instance files](#kit-files-and-instance-files) for the
   pre-drafted order). `npm run terms -- check <paths>` screens the named
   files, and `node scripts/terms.mjs branch` the lines a branch adds against
   its merge base with `main` (on `main`, what the last merge brought in).
   Each prints the status line and a `CONTEXT` line for each context-mode
   match, prints a `FAIL` line on standard error for each refuse-mode match,
   and exits nonzero for a refuse-mode match alone. `npm run test:docs` runs
   the branch screen as its `terms` task, relays the `CONTEXT` lines when the
   task passes, and advises `local-terms list: unavailable` where no list is
   registered. The publish helpers for a planning branch, a kit update and an
   order branch screen the lines their branch adds the same way before the
   first push: a refuse-mode match refuses before anything is pushed, and a
   context-mode match is printed by file and line and the publish proceeds.
   A stage reads what the screen lists: the executor before its handoff, the
   verifier, the final reviewer and a planning pass before its publish each
   run `node scripts/terms.mjs branch`, read every listed line beside the
   entry it matched, reword a line that names the listed thing, and state how
   many they read (see [Document quality](#document-quality)). Target
   publication also needs the instance's own
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

   A registered repository's profile is its entry and its index. What a
   session learns about one area of the target is written as an area note
   beside the profile (`docs/repositories/<id>/<area>.md` for the profile
   `docs/repositories/<id>.md`), opening with a marked JSON block that
   names the target paths it covers and the target commit it was written
   at. The dispatch briefing of every order on that repository prints the
   profile's path, each note with its paths, its commit and the number of
   commits on the registered clone's base branch that touched those paths
   since, or `unknown` where the clone does not hold the commit, and,
   where the order's header names a workstream, that document with its
   Rules section. The count is shown and refuses nothing. The
   [profile convention](repositories/README.md) states the note's form,
   and [Planning in this instance](#planning-in-this-instance) how a large
   target is studied area by area.

   <!-- operator-commands register-repository: A planning pass files the registration order (the repository under `repositories` in `dotln.config.json`, its profile, the outward vocabulary and the operator's grant); its executor records the clone, you merge that order before any target order starts, and each target order then runs like any other. -->
   ```sh
   npm run worktree -- clone <id> <absolute-path>
   ```
   The publish applies three checks to the branch, the commits, the title and
   the composed body (the reviewed prose, the generated Change table and the
   target checks): launchpad identifiers (`WO-NNN`, `WO-NNN-DNNN`, `FUP-<16
   hex>`, `VER-NNN`, `FINAL-NNN`, `REVIEW-NNN`, `WS-NNN`) and `refuse:` terms
   refuse, naming the line, the part of the body and, in a Change row, the
   added path; review words and context-mode terms are listed the same way and
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
   launchpad root. Where the registration files records into the target
   (`records` is `target`, step 5), before `npm run resume --
   target-records` files the order's records there the reviewer commits the
   instance records (the order's records and evidence) on the order branch:
   each filed record's footer names that launchpad commit, at which its
   relative links resolve once the records branch is published, and the
   filing refuses while a source or a file it links is uncommitted (see
   [Releases in this instance](#releases-in-this-instance)). Where it keeps
   them in the instance (`records` is `instance`) no records step is
   offered or owed: the reviewer commits the instance records, the target is
   published at the reviewed commit, which the publish refuses to leave
   behind when the target's HEAD differs from it, and the order's own publish
   carries the records. An order whose records were already filed keeps them
   in the target whatever the registration now says, and its publish says so
   (see [Working as a team on one instance](#working-as-a-team-on-one-instance),
   which cites the decision). The hook withholds
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
   output while keeping its material checks (the default is `"delete"`). A
   path may use `**` as a whole segment for any number of segments and `*`
   within one segment, and its last segment keeps a literal part with a letter
   or digit, so one class line covers a whole workspace: an Nx class with
   Vitest declares `"disposable": ["**/node_modules", "**/.vite", "**/.vitest"]`
   once for every project's caches, while `*`, `**`, `**/*`, `libs/**`, `*.*`
   and `.*` are refused at registration (see [Owned cleanup and retention](#owned-cleanup-and-retention)). Use
   `release: { "policy": "declared", "displayName": "My product" }` with the
   order's `**Target release classification:**` header for a tagged target
   release. The optional name defaults to the registration id and changes the
   Release title and tag message, never the tag name or an existing Release; turn on the forge's
   delete-branch-on-merge setting for the target, since the kit deletes no
   remote branch.
5. Copy `dotln.config.example.json` to `dotln.config.json` when this
   instance elects a feature or moves a document root; an absent file means the default layout
   under `docs/`. The example declares only the `docs` base, from which every
   other root derives; a root declared on its own stays where it is declared
   when the base moves. A registered repository declares its own `gate`
   (named argv commands with timeouts and plain/review selections) and optional
   `documentationRoot` (default `docs`) and `records`, which says where its
   orders' records go: `target`, the value when the key is absent, or
   `instance`. A target order runs that gate. With `target` its order,
   decisions and reports are filed under that root's launchpad layout in the
   target, by the records step of step 4; with `instance` they stay in this
   instance, as a launchpad order's do, and nothing of them is committed in
   the target. The default suits a repository the instance's owner owns; an
   instance that works a team's application repository sets `instance`,
   since the default would file every order's records into the team's
   repository. The value is read from the instance's `main`, where
   registrations are merged: an order's status, its briefing and both of
   its publishes follow it there, whatever the order branch's own copy of
   the file says. Either way a target order's records never leave the instance
   for core: what an instance sends core is the block of what stops it, in
   generic words (§Planning in this instance; the team section cites the
   decision).
   `drive.sandbox` elects the sandbox a routed run (`drive: WO-NNN`) gets on
   either host: `host` (the default) keeps each host's own policy; `off`
   launches unsandboxed in the form each host documents, `sandbox.enabled
   false` through Claude's launch settings and `--sandbox danger-full-access`
   with no approvals on Codex, for every phase worker the drive launches (an
   operator's own router session keeps the policy it was started with).
   Elect `off` only where this instance's environments are unsandboxed; each
   receipt records the election and, apart from it, what the host applied.
6. Tell this instance's own session: **Start WO-001 in its own worktree.**
   WO-001 inspects Claude Code and any other host `dotln.config.json` elects;
   it looks for no other agent harness or model provider and invokes none
   (see [Features](#features), which cites the decision).
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
   canonical record); when status warns that `docs/control/current.md`
   disagrees with the fold, `npm run resume -- status --refresh` rewrites
   the file from the fold and appends no event. It runs `npm run meta` to
   generate the decision index
   from this instance's own records before its first gate, and again whenever
   its decisions change. The export seeds the lineage index; for an older
   export, step 1 or the update branch of §Taking upstream updates generates
   and commits it, and bootstrap never writes it. Run
   `node scripts/lineage.mjs index` after editing the ledger. Then enter
   `resume: next`. The session reads the operating contract (`CLAUDE.md`,
   symlinked as `AGENTS.md`); its generated harness block routes each resume
   phrase to the role skill under `.claude/skills/` or `.agents/skills/`, and
   the generated hooks enforce the compiled refusals where the harness runs
   them. A role's skill holds its own procedure and the shared rules that
   bind that role, each whole and once; a rule a role's procedure never
   reaches is not in its skill
   ([product 07 §Discipline](product/07-execution-guide.md#discipline)).
   The operator merges each pull request of the instance's own repository
   with a merge commit: release close requires the order's branch in
   `origin/main`'s history, which a squash or rebase merge rewrites. A
   registered target's pull request merges by the method that repository's
   team uses (§Releases in this instance).

<!-- operator-commands run-order: From clean `main`, start each order in its own worktree with its id and its order's path (the first is `WO-001` at `docs/work-orders/WO-001-environment-truth.md`); in a session opened in that worktree, type each phase's phrase as a message of its own once the phase before it has completed, or type `drive: WO-NNN` in `main` to run the phases in fresh sessions until your merge (product 07's phrase table names each phase). -->
```sh
npm run worktree -- start WO-NNN docs/work-orders/WO-NNN-<slug>.md
```

<!-- operator-commands run-order -->
```text
resume: next
resume: verify
resume: final review
```

<!-- operator-commands close-order: Merge the order's pull request with a merge commit, then type this phrase in a session in the instance's `main`: the close updates `main`, publishes the order's tag and Release and cleans up its worktree. -->
```text
resume: release close
```

If an older instance already activated WO-001 on `main`, tell **that instance's
own session**: **Update from the refreshed starter and recover WO-001 into its
own worktree by the refreshed starter's kit guide, preserving its verified work
and records.** This instruction authorizes the session to perform the update
and recovery. The operator types phrases and merges pull requests; the session
performs the Git commands. The phrase names the refreshed starter's kit guide
because an instance exported before this procedure holds an older copy; its
session reads this section from the refreshed starter, for example `git show
upstream/main:docs/KIT.md`.

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

## Plan-first mode

To read the proposed change before implementation, elect this mode in
`dotln.config.json`:

```json
{ "version": 1, "features": { "plan-first": true } }
```

Start the work order and say `resume: next`. The executor drafts code in owned
scratch and gives you three documents under `evidence/WO-NNN/plan-first/` in
the order's documentation root. For a self order they live under this
instance's evidence root. For a target order they follow the repository's
`records` value (§First steps): with `instance` they live under this
instance's evidence root too, and with `target`, the value when the key is
absent, in the target repository's configured documentation directory,
where they are committed with the change and the target's publish refuses
their paths, which carry the order's number.

- `plan.md` explains where the change goes, why, the contracts it needs,
  decisions and alternatives, and any question that needs your judgment.
- `proposal.md` explains each changed file and includes the complete proposed
  diff, including additions, deletions and binary changes.
- `conversation.md` keeps the discussion across sessions. Both you and the
  executor append dated entries; the executor never rewrites your entries.

Read the plan and proposal, then reply in the terminal or append an entry to
`conversation.md`. Say `resume: next` when returning after a file edit. The
executor answers each new question or correction and regenerates the two
proposal documents. Terminal replies are paraphrased into the conversation.
Before carrying your words to a screened document, the executor announces any
needed transformation in the conversation. A conversation kept in a private
target stays private; one kept in this instance, a self order's or a target
order's under `records: instance`, must itself pass the publication screen,
which may require you to rephrase an entry.

Approve the current proposal in ordinary words, such as “Looks good, build it.”
The executor captures that approval and records `PlanApproved` for the exact
proposal before applying its candidate. It adds the approval paraphrase before
recording approval; a metadata refresh for that entry preserves the reviewed
plan, proposal and complete diff. Any substantive change needs your approval
again. A later proposal, a changed conversation or a moved base requires
renewed approval. The executor integrates `main` before its complete run when
`main` has moved, and that integration moves the base, so after it the executor
asks you to approve the unchanged proposal again; keeping an approval across a
clean integration is the recorded follow-up of
[WO-242-D026](evidence/WO-242/decisions.md#wo-242-d026--verification-boards-the-approval-an-integrate-first-fast-forward-clears).
Until approval stands, the hook refuses observed
source writes and the apply and readiness helpers refuse implementation. On
Codex, direct tool writes are governed by the role instructions and host
permissions; the helpers enforce their own boundaries in process on every host.
A driven order stops while it awaits approval. Resume the executor to record
your answer, then drive again. Repairs after failed verification keep their
existing bounded repair procedure.

The executor uses `node scripts/plan-first.mjs draft WO-NNN` to create its
candidate, `diff WO-NNN` to inspect it and `apply WO-NNN` after approval. A moved
base uses `draft WO-NNN --new`, retaining the previous candidate. The lifecycle
commands are `npm run resume -- plan-proposed WO-NNN <actor-flags>` and
`npm run resume -- plan-approved WO-NNN --capture <ignored-intake-path>
--capture-hash sha256:<digest> <actor-flags>`. You need not type these commands;
the executor records them from your direction. Turning the mode off preserves
the ordinary direct-execution workflow.

## Features

`dotln.config.json` is this instance's configuration file. Its `features`
section accepts named booleans or an election with your own reason:

```json
{
  "version": 1,
  "features": {
    "tinkerer-economy": false,
    "private-destination": { "on": true, "note": "This repository holds our own project records." }
  }
}
```

An absent section keeps the existing defaults: Tinkerer economy on,
plan-first, private-destination, desktop-control, auto-update-upstream and
verbatim-operator-words off, and each host other than Claude off unless this
instance's control log attests it.
Plan-first adds an operator review of the proposed change before
implementation.

Host support is an election with one inference. `host-codex` and
`host-copilot` are off unless elected, or unless this instance's committed
control log attests the host: a lifecycle attestation in
`docs/control/resume.jsonl` or an order segment under `docs/control/orders/`
whose harness is `codex-cli` or `copilot-cli`, a phase the operator ran under
that host. A discovery record turns no host on: an observed version in
`docs/discovery/environment.json` shows only that an inspection found the
host's CLI, and the table names it as showing the host without an election
([decision](evidence/WO-276/decisions.md#wo-276-d057--part-g-as-judged-the-seeds-name-claude-code-alone-a-discovery-record-turns-no-host-on-the-operators-commands-are-a-generated-page-and-what-core-should-hear-is-one-file)). Claude's surfaces are
always emitted; an elected or inferred host adds its own (`.codex/` and
`.agents/skills/`) and its profile in the harness manifest. The table names
the source, `elected` or `inferred:` with the attestation rows, and `--json`
adds the attestation counts. An election of `false` beside attestations that
show the host is respected, and the table says what they show; a host this
instance used only in sessions it never attested is elected by hand. The
starter's record shows no other host, so a clone starts Claude-only
([decision](evidence/WO-258/decisions.md#wo-258-d003)), and its first order
inspects no host it does not elect
([decision](evidence/WO-276/decisions.md#wo-276-d057--part-g-as-judged-the-seeds-name-claude-code-alone-a-discovery-record-turns-no-host-on-the-operators-commands-are-a-generated-page-and-what-core-should-hear-is-one-file)). `auto-update-upstream` is this instance's
standing opt-out of the rule that no planning or entropy pass takes a newer
starter release unasked (§Taking upstream updates,
[decision](evidence/WO-258/decisions.md#wo-258-d005)), and
`verbatim-operator-words` its opt-out of the rule that committed text
paraphrases the operator (§Document quality,
[decision](evidence/WO-259/decisions.md#wo-259-d005)). A misspelled
name refuses with the valid names and `npm run features -- list`. Existing keys such as
`kit.applyInstanceActions`, `release.*`, `build.*`, `drive.sandbox` and the
budget keys stay where they are; putting their inventory ids in `features`
refuses and names the key to edit.

Run `npm run features -- list` for the table or add `--json` for structured
values. `npm run features -- render` writes `docs/control/FEATURES.md`
(under your configured control root); `npm run features -- check` refuses a
stale page. `npm run meta` refreshes it, and the document gate checks it.
Saved `build.loadout` and `build.profile` selections are unread; the harness
CLI options remain separate. The subagent cap still reads the default
`docs/control/budgets.json` if you relocate your control root; the table names
that actual source, while process bounds and retention follow the relocation.

The table comes from the registry in `scripts/lib/feature-registry.mjs`:
each row names its scope, default, effective value, source, meaning, election
key and consumer.
`unread` means the switch has no effect; a queued order identifies a future
consumer. Core rows describe core's choices, not a rule this instance must
adopt. An order that closes without updating its reader produces a planning
advisory, not a refusal of another order's gate.

After changing an emitted election, run `node scripts/harness.mjs emit`
and `node scripts/harness.mjs check`. Turning Tinkerer economy off removes
its executor support; turning a host off removes the surfaces the previous
manifest installed for it and the directories that leaves empty, and keeps
any other file there ([decision](evidence/WO-258/decisions.md#wo-258-d004)). The old overlay `equip`/`unequip` choice for it was
accepted with a migration advisory through kit release v0.118.0 and is
refused since v0.119.0: an overlay that names `tinkerer-economy` refuses the
emit, the feature table and the elections read until the entry is removed
and the election made in `features.tinkerer-economy`.

Private-destination changes only the exported instance's known §Secrets
paragraph: it admits the owner's ordinary project links and identifiers
inside that instance. A customized paragraph requires review before the
election can be emitted. Turning the election off restores the default
paragraph. Credentials stay excluded everywhere and outward artifacts
still pass private-terms and publication screens. Core's locked floor is
unchanged. Desktop-control still requires the operator's explicit request
in the session after the instance elects it.

The generated harness contract's refusal classes, the single-writer
reservation and the clean-room floor are not electable. They are the floor.

## Planning in this instance

The same planning commands run here using this instance's records. Commit the
export and install its pinned dependencies first. On clean `main`, run
`npm run plan -- start first-pass`; it creates the planning branch and reads
the current follow-up feed. Draft this instance's orders and sequence, then
record its dated planning pass in `docs/lineage/idea-ledger.md`. `plan start`
also writes the pass's planning document with its standard section headings.
Its `Rules recorded` section starts as an empty block: a pass that writes a
standing rule from the operator's words into a standing document, this
instance's operator record included, names the rule there with the
document, the section, the message's journal reference and its capture
digest. `npm run plan -- check` refuses a rule whose message the session
journal lacks, one from the host's task notification, one from a background
worker's hand-back (journaled under the host's source `host-agent-handback`,
never as the operator's), one from a message journaled as a question, a class
the journal contradicts and a digest that is not the message's; the operator
strikes a rule by removing its entry
([decision](evidence/WO-259/decisions.md#wo-259-d008)).

<!-- operator-commands first-pass: In a Claude Code session on the instance's clean `main`, type this phrase as a message of its own: the pass starts its planning branch, files the instance's orders and sequence, refutes them with one background worker and opens the pull request you merge with a merge commit. -->
```text
planning: first pass
```

An order a pass filed that nobody activated leaves the sequence in one of
three ways, and its file is not simply deleted: the register row allocated
to it would then name nothing, and the reason would be nowhere. Where another
order takes its work, its file becomes an umbrella record: an `Umbrella
record` field in its header and typed `superseded` entries that name the
successor, which the index lists under Superseded. Where the operator drops
it, `npm run resume -- withdraw --disposition abandoned --reason <text>
--capture <path> --capture-hash sha256:<digest> <actor-flags>` withdraws it,
named with `--work-order` or by its own branch: the withdrawal is the
order's first event and records its file, the index lists the order as
withdrawn and the sequence lets it go. Where the operator retires a proposal
whole, the pass moves its file to `docs/retired/` with its bytes intact and
a row on that directory's page. A pass that drops its own draft before its
pull request merges edits its own branch and needs none of the three
([decision](evidence/WO-276/decisions.md#wo-276-d109--part-r-opens-on-checkpoint-50-the-sites-that-compare-an-orders-number-with-one-of-cores-the-readers-of-what-the-part-moves-and-the-two-gates), [as built](evidence/WO-276/decisions.md#wo-276-d112--part-r-as-built-the-predicate-at-ten-sites-a-withdrawal-as-an-orders-first-event-a-register-judged-as-it-is-left-a-known-issue-disposed-the-preflight-advisory-and-the-re-task-and-capture-rules)).

A capture holds the operator's own words. Where a message carries a block
the operator pasted that a command or another session wrote, the pass keeps
the block whole in the ignored local planning lane
(`docs/control/local/plan/`), and the capture names it and its SHA-256; the
verbatim screen then compares committed text with what the operator wrote
([decision](evidence/WO-276/decisions.md#wo-276-d109--part-r-opens-on-checkpoint-50-the-sites-that-compare-an-orders-number-with-one-of-cores-the-readers-of-what-the-part-moves-and-the-two-gates), [as built](evidence/WO-276/decisions.md#wo-276-d112--part-r-as-built-the-predicate-at-ten-sites-a-withdrawal-as-an-orders-first-event-a-register-judged-as-it-is-left-a-known-issue-disposed-the-preflight-advisory-and-the-re-task-and-capture-rules)).

A worker may continue work it holds. A re-task is still one use, and it is
admitted for three things: to recheck what the worker found, to carry on the
research it was given from what it has already read, or to restate in the
required form a report that was refused for its form, changing no finding.
The worker writes only to session scratch and the parent stays the sole
repository writer; a review or a refutation is never continued into a second
judgment ([decision](evidence/WO-276/decisions.md#wo-276-d109--part-r-opens-on-checkpoint-50-the-sites-that-compare-an-orders-number-with-one-of-cores-the-readers-of-what-the-part-moves-and-the-two-gates), [as built](evidence/WO-276/decisions.md#wo-276-d112--part-r-as-built-the-predicate-at-ten-sites-a-withdrawal-as-an-orders-first-event-a-register-judged-as-it-is-left-a-known-issue-disposed-the-preflight-advisory-and-the-re-task-and-capture-rules)).

For an initiative, a body of work larger than one pass can file honestly,
plan the rolling way: lay it out, file a wave, run it, revise. The layout is
the Layout section of the initiative's workstream document
(`docs/workstreams/WS-NNN-<slug>.md`): what exists, linking the target's
area notes where there are any; what the initiative asks, in this instance's
own words; the way there, as phases of planned items with what each depends
on and which may run side by side; and what is unknown, with the research
that would settle it. A new export's
[workstreams page](workstreams/README.md) carries the section with a worked
example; an instance exported earlier keeps its own page and reads the four
parts here. A planned item is a line of the layout: it has no identifier and
no order file, it is not a member order, and it becomes one when a pass
files it. A pass that is handed an initiative writes or revises the layout
first and files only the orders the next wave needs, the ones whose inputs
are known; the refuter judges those and the sequence, and no check judges
what the layout says: the index and the plan check read the workstream's
marked block alone, and the document check reads the layout's links and form
as it does any document's. As a wave lands, the next pass revises the layout
in place and files the next. A phase may carry the planner's estimate of orders and spend, taken
from this instance's own usage report (`npm run meta -- --usage`) where it
has orders to read, and says where its figures came from. The team reads the
layout where it reads the plan: in the instance, or in the target's
documentation root, where a target-scoped pass publishes a copy among its
`planning/` files (`npm run plan -- target-publish`, below). How large an
order may be is this instance's own rule to set: where its operator gives
one, a pass records it as it records any standing rule (above) and sizes the
layout's planned items to it
([decision](evidence/WO-276/decisions.md#wo-276-d093--part-o-begins-on-checkpoint-43-an-initiatives-layout-is-a-section-of-its-workstream-document-planned-items-are-not-orders-and-a-pass-files-the-next-wave-and-the-twenty-seventh-critics-four-points)).

An order may be paced across days. Where this instance states what a day
may use, `spend.daily` in `docs/control/budgets.json` holds the figure: in
tokens (`tokens`), in dollars (`usd`, compared with an estimate at the
prices this instance declares in `dotln.models.json`) or both. A new export
carries the field with both null; an instance exported earlier adds it. Each
prompt's facts then carry one line with the day's use so far beside the
figure. The use is this checkout's sessions by local calendar day, the
reading `npm run meta -- --usage` prints, every class of token counted, cache
reads among them; a person working in two checkouts sums by hand. A dollar
figure on a day that holds a model with no declared price, a session that
attests no model or one with no count shows the day's tokens and `unknown`
for the estimate, with what the sessions that do have an estimate come to;
the day's tokens are likewise the least the day is known to have used, and
a session with no count takes nothing from what another measured
([decision](evidence/WO-276/decisions.md#wo-276-d131--the-repair-of-ver-002-ten-findings-in-code-each-closed-as-the-class-it-names)).
At or above the figure, by the estimate or by that least amount, the line
tells the executor to finish the step in hand, write the standing and end
the turn. It is advisory and refuses nothing. The
standing is `docs/evidence/WO-NNN/standing.md`, which the executor writes at
a stop and replaces at the next: the steps of the execution plan done, the
step in hand and its state, what comes next, and what is undecided. The next
session's briefing names the file, in the implementation and in a repair
alike; the phase's completion (`implementation-ready`, or `repair-complete`
in a repair) removes it; and the hours the order sat are not counted against
its phase's bound (Owned cleanup
and retention, below)
([decision](evidence/WO-276/decisions.md#wo-276-d098--part-p-begins-on-checkpoint-45-the-bound-reads-worked-time-from-the-phases-journals-the-days-figure-is-advisory-and-the-standing-is-a-file-of-its-own-with-the-parts-consumer-map-and-its-two-gates)).

No planning or entropy pass takes a newer starter release or merges upstream;
only the operator's words in that session do. `node scripts/launchpad.mjs
update --finish`, `update --publish` and core's `export --update` refuse under
a journaled `planning:` or `ideation:` dispatch or a pending entropy review or
refutation dispatch, naming the operator's in-session request as the route; `--operator-request --capture
<ignored intake file> --capture-hash sha256:<digest>` records that request,
with its hash in the session journal and, for a from-core update, in the
sibling receipt. A session with no journaled dispatch is admitted as before.
An instance that elects `features.auto-update-upstream` lets its passes take
an update unasked: the hold admits the command, and the session journal's
admission row names the election instead of a capture
([decision](evidence/WO-258/decisions.md#wo-258-d005)).

What this instance has learned that core should hear is kept in one file at
its root, `FOR-CORE.md`, which the export seeds with the form of an entry and
no entry. Each order's final review appends an entry for what the kit itself
got wrong or made hard during that order, where it found anything; each
planning pass reads the file at entry, appends its own entries there, sets
`answered` on those a release this instance has taken answered, and writes no
block for core in its planning document. An entry is a second-level heading
(the date, the order or pass it came from and one line) over a `json` block of
three fields (`kit`, the kit version; `stopsNextOrder`, `true` or `false`;
`answered`, `null` or the answering release's version), then generic prose:
what the kit did, what was expected, the command and its message, and the
route used meanwhile. `node scripts/docs-check.mjs` and the document gate
judge each entry's fields and name the entry and the field they refuse; the
local-terms and private-path screens judge the file as they judge every
document. Nothing leaves this instance on its own: an instance still asks core
only for what stops its next order and has no working route here, each entry
says whether it does, and what to paraphrase to a core planning pass or send
is the operator's choice (operator direction, 2026-11-09;
[the pass that recorded it](planning/passes/whole-plan-and-codebase-review-2026-11-09.md);
[decision](evidence/WO-276/decisions.md#wo-276-d057--part-g-as-judged-the-seeds-name-claude-code-alone-a-discovery-record-turns-no-host-on-the-operators-commands-are-a-generated-page-and-what-core-should-hear-is-one-file)).

<!-- operator-commands tell-core: Read the instance's `FOR-CORE.md`, which its final reviews and planning passes write, and paraphrase the entries you choose to a core planning pass or send them yourself; nothing leaves the instance unless you carry it. -->
```sh
cat FOR-CORE.md
```

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
  `npm run plan -- check` checks the receipt and continuing subject, and
  `--timing` adds where its seconds go by step. A sequence may hold no order:
  once the last order has closed, a pass may let it leave and file none, and
  the refuter's prompt then names the empty sequence as its subject
  ([decision](evidence/WO-258/decisions.md#wo-258-d015)).
- `npm run entropy -- subject` names the next review action. Live review and
  refutation belong to the operator's instance; the export fixture exercises
  only `review --transport fake` and its receipt, never a live model. A filed
  receipt renders the frozen copy as `<tmp>/…`, labels a target subject's
  launchpad tree as the planning branch in progress, names the uninstalled
  copy and the unobserved host coordination in its confinement sentences,
  and screens its summary and its Markdown for private absolute paths before
  filing: a refused text is named with its line, the rejected result is
  retained at the lane the refusal prints, and the same command refiles once
  the text is corrected.
- Refresh `npm run work-orders -- index` and `node scripts/lineage.mjs index`;
  their `--check` forms check the projections. `index --check` also prints
  `criteria advisory: WO-NNN criterion N: <what matched>` for each active or
  open order's criterion whose wording often marks one of the five defect classes
  (bookkeeping, later-phase, absent-input, host-behavior, contradiction); an
  advisory refuses nothing, and the planner screens each criterion against the
  classes before filing. An open order whose criteria list the reader cannot
  read whole is refused by the check, naming the order, the line and the
  remedy ([decision](evidence/WO-276/decisions.md#wo-276-d175--a-criteria-list-the-parser-reads-as-shorter-than-written-is-refused-by-every-reader-of-it-and-never-returned-shorter)). Run `node scripts/docs-check.mjs`,
  `npm run publication:check`, `npm run reader -- check` and
  `npm run test:docs` before handing off the planning pass.
- Release-close reads can be inspected with `npm run release -- check-surfaces
  --local` and `npm run resume -- status`. With no lifecycle order declared,
  the former reports that release surfaces are unavailable. With an order,
  it checks the instance's release declaration and license surfaces as described
  below; a target order records no release. These reads do not publish anything.
- `node scripts/refute-plan.mjs publish --title <title> --body-file <path>` ends
  a pass; `npm run plan -- publish` takes the same flags. The emitted
  `.claude/settings.json` allows three publish helpers by their node spelling,
  that one, `node scripts/launchpad.mjs update --publish` and
  `node scripts/worktree.mjs publish` (a target order's publication, admitted by
  WO-257 as WO-246 admitted the first two), and nothing else: Claude Code
  resolves a narrow allow rule before its auto-mode classifier, unless
  `autoMode.classifyAllShell` is set. No rule admits raw `git push` or `gh`,
  and `npm run` has none. On a `planning/<date>-<slug>` branch with a clean tree and its planning
  document committed, it lints the title and body, pushes the branch to
  `origin`, opens the pull request against `main` on the repository `origin`'s
  push URL names, ready rather than draft, and prints its URL. A title is a
  gitmoji and a subject, with or without a conventional type, or a conventional
  type alone, and has no length limit. A refuse-mode private term refuses, in
  the title, the body or the lines the branch adds, and so do an absent
  local-terms list and AI attribution. A context-mode match refuses nothing: the
  command prints it before the push as a `CONTEXT` line naming the file and
  line, or `title` or `body` and the line there, and the pass reads each listed
  line beside the entry it matched before it publishes
  ([decision](evidence/WO-276/decisions.md#wo-276-d010--where-each-screen-lists-a-context-mode-match-steps-a2-to-a4)). The public review words pass: a
  launchpad's own pull request is about them. This route needs no
  `outward-vocabulary.json`. A retry after a failed create repeats no push and
  adopts the open pull request whose head, branch and base match; that pull
  request keeps its title and body, which the command does not edit.

Export writes these instance-owned seeds once; ordinary kit updates leave their bytes alone:
`docs/planning/sequence.md`, `docs/planning/followups.json` (empty schema-1
register), `docs/control/doc-baseline.json` (empty editorial baseline),
`docs/control/budgets.json` (kit defaults, no acceptances), and
`docs/lineage/idea-ledger.md` (header and status vocabulary only). None is
manifest-listed. The initial lineage index is seeded; its command regenerates
it after ledger edits. Decision and work-order indexes are generated by their commands. Core's register, ledger, editions and score history
are not copied.

Release close refreshes the declared starter's template seeds as well as its
kit files. A replaced seed must still match a proven prior export. For
`README.md`, a customized, missing or non-regular copy is kept with its reason
in `keptSeeds` and never refuses the refresh; a proven older rendering is
rewritten and listed in `rewrittenSeeds`. The close's summary line names both,
as `seeds published:` and `seeds kept: README.md (<reason>)`, in the preview
and the real close alike. Other changed templates still
refuse a customized seed by path before any push. Unchanged templates leave
customized copies intact; an unusable `CLAUDE.md` or `.gitignore` refuses with
its remedy before any write. Preserve those customizations and restore the
prior exported template through a reviewed change before retrying.
Forks receive starter commits through their own session's update on the
operator's word; their control records and instance work are preserved.

A fresh instance has no `docs/product/00-vision.md`,
`docs/product/13-uifa-roles.md`, `docs/planning/capability-table.md` or
`docs/planning/passes/critical-path-2026-09-08.md`. The planning subject names absent
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

A large target is studied an area at a time, each area one research order
([the execution guide](product/07-execution-guide.md#research-and-guided-operator-work-orders))
whose deliverable is that area's note beside the target's profile. Choose
the area by its paths. State in the order's Design what it may read and
what it may spend (the directories, the wall clock, the tokens where the
host reports them) and where it stops. Write or revise
`docs/repositories/<id>/<area>.md`: its block's `paths` and the `commit`
that was read, each rule the area follows with the file that shows it, the
exceptions found and what is unknown. Add the note's line to the profile's
list, and record in the note and in the order's handoff what was not read.
No step reads the whole target, and no program writes a note from the
tree. The order's verifier judges the note against the order's method
criteria; `node scripts/docs-check.mjs` and the document gate judge the
block's two fields, naming the file and the field they refuse, and nothing
of the prose; and each later order on that repository is briefed with the
note and the commits that have touched its paths since, so a role reads
the notes that cover what it changes and checks an aged rule against the
code ([decision](evidence/WO-276/decisions.md#wo-276-d086--part-l-as-built-area-notes-beside-a-targets-profile-read-by-the-document-check-and-the-briefing-and-one-sentence-in-three-roles)).

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

An instance's order numbers are its own, through the same range as core's.
Where the kit's code ties a behavior to the number of one of core's orders
(a sentence in one receipt, the start of the release-note contract, an
exemption, two one-time continuations, a feedback path, a line on two index
cards, a known fact of the plan refuter's brief and core's persisted
correction record), it first asks whether the root is core's own, so an
instance's order of any number is an order like any other. A receipt page an
earlier release wrote with core's sentence still reads
([decision](evidence/WO-276/decisions.md#wo-276-d109--part-r-opens-on-checkpoint-50-the-sites-that-compare-an-orders-number-with-one-of-cores-the-readers-of-what-the-part-moves-and-the-two-gates), [as built](evidence/WO-276/decisions.md#wo-276-d112--part-r-as-built-the-predicate-at-ten-sites-a-withdrawal-as-an-orders-first-event-a-register-judged-as-it-is-left-a-known-issue-disposed-the-preflight-advisory-and-the-re-task-and-capture-rules)).

For an operator-authorized scope change, `npm run plan -- amend-order`
binds only an order in the latest judged planning horizon. The never-judged
seed WO-001 has no receipt to amend: record the actual authorization and
bounded scope in its structured decisions and run the ordinary planning,
document and lifecycle checks. This supplies no additional authority,
planning verdict or hold disposition. A required missing planning receipt
still needs normal planning/refutation; do not create a fictitious pass to
enable amendment.

Each order's final review appends to the root `FOR-CORE.md`, before its
closeout checks, one entry for what the kit itself got wrong or made hard
during that order, where it found anything, in the form §Planning in this
instance gives; the entry is committed with the reviewed order
([decision](evidence/WO-276/decisions.md#wo-276-d057--part-g-as-judged-the-seeds-name-claude-code-alone-a-discovery-record-turns-no-host-on-the-operators-commands-are-a-generated-page-and-what-core-should-hear-is-one-file)). Each kit release ships
`docs/OPERATOR.md`, the operator's commands at that release: core generates it
from the command blocks this guide marks for each step of the cycle, so a
release that changes a marked block changes the page, while what a release
changed for an instance stays in its Read before upgrading
([decision](evidence/WO-276/decisions.md#wo-276-d057--part-g-as-judged-the-seeds-name-claude-code-alone-a-discovery-record-turns-no-host-on-the-operators-commands-are-a-generated-page-and-what-core-should-hear-is-one-file)).

The instance owns its root `README.md` and may replace it immediately. Its
release block is optional: with neither marker present, release preparation
writes no README claim and the close reports `not carried`. If either marker
is present, keep exactly one ordered block containing only the generated
version line. Release surfaces check that block, component versions and
workspace pins, the PR and release-notes body profile, license files and package publication
guards. `docs/LEGAL.md`'s three pins are checked only where this instance
actually declares that file; absence reports unavailable for those pins alone.
Set `release.displayName` in this instance's `dotln.config.json` to choose
its release name, then run `npm run release -- prepare --local` to refresh
the version claim if you carry the block. Fresh exports use `DotLn-Enterprise-Starter`; absent
configuration preserves the historical `DotLn` default. The name must be
nonempty, trimmed and single-line, without control characters, backticks or
release version tokens. Updates preserve this instance-owned configuration.
Each release retains the name configured at its release commit; changing
the name affects future releases, not older tags or Releases.
The seeded WO-001 carries `v0.1.0`; `npm run release -- prepare --local`
assigns later versions above this instance's own tags. A target order's
launchpad records branch records no release and carries links to the records
committed in the target. Each record filed into the target ends with a footer
naming the launchpad commit, made before the filing, at which its relative
links resolve once that branch is published
([decision](evidence/WO-259/decisions.md#wo-259-d012)). If it carries a release block, its claim stays at
least as new as the latest release. It needs no release-notes file; `release prepare
--local` reports no release and changes no files for that target order.

The two repositories of a target order merge by different rules
([decision](evidence/WO-276/decisions.md#wo-276-d087--part-m-as-built-a-target-order-closes-when-its-base-holds-the-reviewed-change-by-ancestry-a-squash-or-a-rebase-or-under-a-commit-named-for-it-the-instance-lists-its-authors-and-the-drive-settles-a-targets-own-release)). The instance's own repository keeps merge commits, as
§First steps says, and no check of it changes. A target's repository merges
as its team sets it: after fetching, the close takes the order as merged
when the target's base holds the reviewed change as the branch itself (a
merge commit or a fast-forward), as one commit whose patch equals the
branch's whole change (a squash) or as a commit of equal patch for each of
the branch's own commits, in the branch's order, each base commit answering
for one of them (a rebase): a branch that makes a change, reverts it and
makes it again is not merged until the base holds all three
([decision](evidence/WO-276/decisions.md#wo-276-d167--the-closes-rebase-rule-takes-one-base-commit-for-each-of-the-branchs-commits-in-the-branchs-order)). It reads Git alone and asks no forge. A
base commit counts where Git's patch identity agrees and the commit is the
reviewed change exactly, file by file: it joins the same blobs, or, where
the base had changed a file since the branch left it, holds the change
merged cleanly into that file and nothing else. So the same edit landed
with other spacing or line endings, or made by someone else at another of
several identical places in a file, is not taken for the reviewed one. The
close prints which it found, the base commit
or commits it matched and how many base commits it read. Where the change
landed under another patch (a squash edited at merge or carrying other
people's changes, a base that changed lines beside the change after the
branch was cut, a rebase that left out a commit of the branch the base
already held, a base rewritten since), nothing matches and the close
refuses with the source retained, naming `--merged-as <commit>`: run the
printed close again with the id of the base commit that carries the change.
The close checks that the commit is in the fetched base, came after the
branch left it and touches a path the change touches, prints its subject and
proceeds; the person naming it takes the judgment that it carries the
change. `drive: WO-NNN` reads a squash or a rebase as the close does and
stops for the attended close where the commit has to be named; in a partial
clone of the target it compares no patches, and its stop names the attended
close too.

For an unmodified older export missing the first-order version or
release classification, the instance's own session updates from the refreshed
starter on the operator's word using the recovery above. The starter supplies
the `(v0.1.0)` heading and `Release classification: minor`; a missing README
release block needs no repair.
If the instance customized those seeds, its session preserves the edits and
resolves the update against the operator's instruction, recording the chosen
values in the order's decisions before release preparation.

## Working as a team on one instance

Several people can share one instance: one of them plans and assigns, and
each works in a clone of the instance's repository with the target's
repository cloned beside it. The kit holds no claim or lock on an order, so
the rest is convention, stated once here
([decision](evidence/WO-276/decisions.md#wo-276-d087--part-m-as-built-a-target-order-closes-when-its-base-holds-the-reviewed-change-by-ancestry-a-squash-or-a-rebase-or-under-a-commit-named-for-it-the-instance-lists-its-authors-and-the-drive-settles-a-targets-own-release)):

- **One person plans.** A planning pass is merged before the next one opens,
  so two passes never file orders against the same horizon.
- **An order is assigned before it is activated**, and the assignment is
  noted where the team reads the plan. A second clone that starts the same
  order activates it again, and nothing detects that.
- **One person carries an order** from its activation through its final
  review and runs its release close. The close re-reads the reviewed gate row
  against the closing machine's installed runtime and cleans up only that
  clone's worktrees, so an order in flight stays in the clone that activated
  it.
- **One order at a time goes through final review, merge and close**, in the
  order the planner sets. An order closed while another's review merges
  cannot integrate again.
- **The target's draft pull request, opened after verification, is where the
  planner reads a teammate's change** before its final review. A team's
  instance registers the team's repository with `records` set to
  `instance` (§First steps), so the order's decisions and reports are in
  the instance's own records pull request and never in the target's
  ([decision](evidence/WO-276/decisions.md#wo-276-d090--part-n-as-built-a-registration-says-whether-its-orders-records-are-filed-into-the-target-or-stay-in-the-instance-mains-value-governs-every-reader-and-a-committed-records-binding-decides-an-order-in-flight)).
- **Each clone keeps its own** local-terms list, intake and clone map; none
  of the three is committed.

One at a time, then: the planning pass, an order's activation (once, by the
person it is assigned to), and the final review, merge and close of each
order in turn. Executing and verifying different orders in different clones
runs side by side.

The instance names the people whose commits are its own in
`contributions.authors`, beside `operatorAuthor`
(§Kit files and instance files): a commit by a listed author passes the
sign-off rule without a trailer, and anyone else's still needs one. The two
repositories merge by different rules: the instance's own with merge
commits, the target's by its team's method, which the close reads from Git
(§Releases in this instance).

## What runs here, and what does not

Desktop control and the operator's own browser sessions are off by default.
The hook and emitted `.claude/settings.json` deny their named tools unless
`dotln.config.json` elects `"features": { "desktop-control": true }`; the
operator must also explicitly request their use in the current session.
An election may instead be `{ "on": true, "note": "the operator's reason" }`.
After changing the election, run `node scripts/harness.mjs emit` to update
the host settings; `node scripts/harness.mjs check` detects a mismatch.
The hook reads the current election on each desktop-tool judgment. In Codex,
tool calls are unhooked, so the generated role text carries the same rule.

Verify a web surface in a browser the session launches, using structured
state, then the DOM and accessibility tree through the Playwright MCP's
snapshot, then network and event data, then a screenshot read as an image,
or use the project's own browser tests. Claude in Chrome and the desktop
app's browser pane use the operator's sessions and need the desktop election.
Playwright is optional; this rule installs no browser or MCP server.

`npm run worker -- review --kind criteria|design|consistency|combined --host
codex|claude` launches one review worker on the named host with the canonical
brief (the generated worker definition, the reviewer brief from the role text,
the order and its diff, and for `--recheck <report>` the earlier findings) and
writes its report and a `.json` record to
`docs/control/local/reviews/WO-NNN/round-<N>-<kind>.md` (a repair's under
`repair-<n>/`, and never over an existing report). `--model <name>`
names a worker or a model of this instance's table (`npm run worker -- list`
prints it) and `--effort <level>` an effort for that one launch; without them
the launch runs the `default` worker for that host. `--subject planning` on a `planning/` branch reviews that
branch's planning documents and orders into `planning-<branch>/` (the name
after `planning/`, any character but a letter, digit, dot, underscore or hyphen
URL-escaped, so no two branches share it), and
`--capture <file>` gives its criteria review the operator's dispatch, which
the report answers item by item in an `## Items` table; `--target <id> --order
WO-NNN` reviews a registered target's order on the target's base and worktree;
`--since <tree>` starts a fresh round 1 over that base in a ladder of its own;
`--part <letter>` names the part of an order in parts whose criteria are due,
and the brief tells the worker to judge the order's design frame and that
part's own text and that the other parts' criteria are not due
([decision](evidence/WO-276/decisions.md#wo-276-d023--a-review-launch-names-the-part-whose-criteria-are-due));
and `--dry-run` prints the command line and the brief it would run. A
consistency report needs its `Traced consumers` table (changed contract,
consumer, command, result) with a generated pages row and a fixture manifests
row, or it is not recorded. Required tables belong to actual report sections;
tables quoted in code, HTML or blockquotes do not satisfy the requirement.
When a round is split into batches, the merger reads required columns by
meaning, including accepted alternative headings and reordered columns.
Finding IDs stay unique across the merged
result and leave room for a later recheck's prefix; the helper validates the
merged result before filing it, including on the recorded-part route
([decision](evidence/WO-257/decisions.md#wo-257-d041--preserve-batch-table-semantics-and-unique-finding-identities)).
`npm run worker -- record --kind <kind> --round <N> --from <file> [--format prose|json] [--batch N] [--brief-sha256 <digest>]` writes an
`Agent` worker's returned text to the same lane as the same record, with
`--host`, `--model` and `--effort` for what ran and `--tree` for the tree it
reviewed. Use `--format prose` for a prose report containing JSON examples;
it preserves the report and adopts no example findings. Use `--format json`
for one structured result, including a fenced result followed by closing
prose; its findings and report field retain their meaning. Multiple possible
results are refused, and so is a brace in the surrounding prose that opens no
JSON object: put the chosen result alone in the input file.
Without the flag, a whole JSON result (optionally fenced) and plain prose
remain supported. Mixed text with a possible result, including one inside a
same-line or multiline code span, is refused before anything is
recorded, naming the two formats. Position and schema validity do not decide
whether an object is an example. The record's `inputFormat` names the caller's
selection, or `auto` when omitted
([decision](evidence/WO-255/decisions.md#wo-255-d042--every-embedded-possible-result-requires-declared-intent)).
The worker is told a budget of about 30 minutes and 120 tool calls and returns
what it has as it nears either, well before the hard limits stop it. An
execution's reviews run as a ladder with an end. Its order's header sizes
round 1 with the line `**Review ladder:**`: `full`, or no line, is three
reviewers over the whole diff; `combined` is one worker carrying the three
briefs; `paired` is the three and the one on the same tree, blind to one
another, whose findings the executor records one by one in the round's
decision (`roundFindings`) before fixing them. Every brief says what blocks:
a finding that names the criterion it fails and an input a writer of this
instance produces, a leak, or behavior `main` had; the executor judges each
finding by that before acting on it, and a reviewer's label is only the
reviewer's claim. A fix dispatch runs no ladder: it repairs what its failed
report names and has that repair read once by one combined worker
([decision](evidence/WO-276/decisions.md#wo-276-d039--part-c-as-built-the-blocking-rule-in-every-brief-one-review-for-a-fix-the-ladder-line-and-the-paired-record)). Round 2 is each reviewer whose findings were
fixed confirming those fixes and reviewing the whole change again, a new
finding admitted only when it breaks an acceptance criterion or a behavior
`main` had; round 3, only when round 2's
fixes changed code, is one combined worker over the remaining delta; then no
reviewer runs, the executor judges what is left, and the handoff's
`self-review:` line records the rounds and the unreviewed lines. A round whose
fixes touch only comments, documentation, formatting, test names or
regenerated files is skipped. A repair made inside an execution after a failed
complete run takes no round: the run that failed judges its own repair, the
next complete run is started with `--keep-going` so that one run names every
suite that still fails, and the handoff's review line counts the repair's
changed lines as unreviewed. An order whose execution plan is divided into
parts runs its ladder a part at a time: a part's ladder runs when that part's
steps and write-backs are complete, a part after the first opens it with
`--since` naming the commit of the checkpoint the part before it ended on, the
limit of three rounds holds within a part, and a complete run that a part's
own step names is that step's evidence
([decision](evidence/WO-276/decisions.md#wo-276-d021--the-role-text-of-steps-a6-a7-a9-a11-a12-and-a15-and-the-installed-roots-bytes)).
A worker hands back with nothing of its own running. A worker whose stop
arrives while a background task it started is live is refused once, naming
each task and the tool that stops it; the tasks are written to the parent
session's journal, and the facts the parent's next prompt prints name a worker
that stopped with one still running. `node scripts/harness.mjs evidence --wait`
awaits a gate run and nothing else: a background task is awaited through the
host's completion signal
([decision](evidence/WO-276/decisions.md#wo-276-d015--what-the-host-gives-at-a-workers-stop-and-what-the-hook-reads-of-it-steps-a8-and-a9)).
The review helper is the route to a Codex reviewer from a Claude session and to
a Claude print reviewer from Codex, and needs that CLI installed and signed in.
Codex's command line leaves a background server of its own running when a run
ends. The kit closes it, and only when no other Codex process is alive to use
it: when a worker the helper launched on Codex returns, and, for a launch that
ended some other way, at the next lifecycle dispatch from another host, which
says what it closed
([decision](evidence/WO-276/decisions.md#wo-276-d143--the-kit-closes-the-background-server-codex-leaves-running-the-sixteenth-complete-run-is-stopped-for-that-change-the-critics-record-and-clock-are-brought-up-to-date-in-the-repair)).
Every worker
use counts against `subagentCap` in `docs/control/budgets.json`: in Claude the
hook counts each launch, each re-task (a `SendMessage` or a resumed agent) and
each kit launch by its literal command, and under Codex the helper counts
its own launch;
`node scripts/harness.mjs usage <session>` prints the counts by host. A
spawned `dotln-worker` that starts a test-runner gate is refused with
`DOTLN_WORKER_GATE_REFUSED`; a review worker probes one test with
`node scripts/harness.mjs bounded -- node --test --test-name-pattern <name> <suite file>`.

After the first steps above, `npm test`, `npm run test:docs` and
`npm test -- --review` run inside this instance without package source. Each
selection first runs the six structural checks: formatting, configuration,
registrations, declarations, generated artifacts and the host's Node and Git
runtime, its memory pressure and, on macOS, the size of its file-events
daemon, which the host check prints and refuses above 1 GiB with the command
that restarts it
([decision](evidence/WO-276/decisions.md#wo-276-d142--a-gate-shows-the-file-events-daemons-size-at-every-start-and-refuses-above-1-gib-after-a-restart-showed-the-daemon-healthy-and-a-measured-comparison-showed-that-where-the-gates-files-are-made-does-not-matter));
a Node outside `engines.node` or a Git below
`engines.git` makes the host check run first and nothing else
([decision](evidence/WO-260/decisions.md#wo-260-d010--the-git-floor-is-git-2310-and-wo-258-d009-is-superseded)).
The generated check includes the runtime manifest, active pinned snapshot
and harness bundle;
`npm run sync` repairs stale derived artifacts. Then `kit-verify` runs instead
of `build`. It hashes every
manifest-listed compiled runtime and test file, and refuses a changed,
missing or nonregular compiled file by path before the selected suites. Other
kit-file changes produce one advisory line. Run
`node scripts/launchpad.mjs verify` directly for the manifest check: it
compares every listed file, and refuses a changed compiled runtime file,
before it asks the instance's own harness check about a generated surface
that differs, since that check loads the runtime
([decision](evidence/WO-276/decisions.md#wo-276-d174--kit-verification-and-an-updates-plan-compare-every-carried-compiled-runtime-file-before-any-of-the-instances-code-runs)).

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

Which of these an order owes at its closeout is one selection, and every
reader names the same checks: the executor's and reviewer's briefings end
with it, as a target order's verifier's does, `npm run resume -- briefing`
prints it again as the order stands, `worktree
integrate` lists it as owed by the order apart from what main's merge
affected, and completion records it as an advisory. A target order owes its
target gate (`--review` when a criterion names a review form) and `npm run
test:docs`. It owes the instance's `npm test -- --review` as well only where
its instance changes reach what that run judges (a kit file, instance source
or configuration, or a record the gates read as input), where it resolved
such a conflict at integration, where a criterion names `npm test`, or where
the selection cannot read or classify an input, whose reason it prints. An
integration that only took in a kit update adds no run of its own. An order
already active when the instance takes this kit release re-runs nothing: its
next briefing or integration prints the selection from its current changes,
and until then a target-only order runs its target gate and the document
gate, since the integrate helper's affected list is no duty of its own.

The observed selections in a fresh fixture instance are:

- `npm test`: `format`, `configuration-root`, `registrations`, `declarations`, `generated`, `host`, `kit-verify`.
- `npm run test:docs`: `format`, `configuration-root`, `registrations`, `declarations`, `generated`, `host`, `kit-verify`, `license-surfaces`, `docs-check`, `terms`, `harness-context`, `plan-refutation-current`, `plan`, `reader-profiles`, `entropy`.
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
| `git-surface` | the kit's Git surface is recorded and confirmed against the Git floor in core |
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
| `resume-docs` | core legacy lifecycle and timing observations WO-030 |
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

### Hooks

The generated hooks enforce the harness contract's refusals where they can
observe a call and journal what they see in the ignored
`docs/control/local/harness/` lane. Codex tool calls are unhooked, so under
Codex the lifecycle commands and the role text carry the same rules. What a
refusal names, the session can run or say; nothing below asks the operator
to run a kit command for a state the kit can judge.

- **Which hooks run for a call.** Before a tool call the permission hook and
  the write observer run for every tool; the writer reservation's hook runs
  for the tools the tool table (`harnessToolEffects`) maps to a shell command
  or a write, and the attribution hook for those it maps to a shell command.
  After a call the read observer runs for every tool, and the lint-directive
  hook for the tools the table maps to a write. A read or a search therefore
  starts three hook processes and a shell command, an edit or a write five.
  How a narrowed hook's matcher is written depends on the hosts that read the
  settings file. Where each of them was observed to read a matcher that
  leaves names out (Claude Code 2.1.322 is the one host so observed), the
  matcher leaves out the names of the other kinds, and a tool the table does
  not name starts all six hooks. Where one was not, as in an instance that
  elects Copilot CLI, the matcher lists the names of the hook's kinds, the
  form every host documents, and a tool the table does not name starts only
  the three hooks registered for every tool; `.claude/harness-manifest.json`
  records which form was emitted and why. A target worktree's settings hold
  the permission hook for every tool, and the writer reservation's and the
  attribution hook narrowed as for Claude Code
  ([the excluding form](evidence/WO-276/decisions.md#wo-276-d105--a-units-matcher-is-an-anchored-exclusion-of-the-names-its-kinds-do-not-cover-observed-on-claude-code-documented-and-not-observed-on-copilot-where-the-host-refused-the-run-and-the-units-own-name-tests-stay-as-they-are);
  [as built, with what a call costs in hooks before and after](evidence/WO-276/decisions.md#wo-276-d106--part-q-as-built-with-both-readings-of-what-a-call-costs-in-hooks);
  [what a call costs, as corrected](evidence/WO-276/decisions.md#wo-276-d108--part-qs-gates-and-what-changed-after-d106-two-edits-to-a-parser-a-pinned-digest-the-part-had-not-run-and-one-statistic-joined-to-the-wrong-sample)).
- **The presence heartbeat.** It has no hook of its own. With a resident's
  store named in `DOTLN_RESIDENT_STORE`, the files of the write observer, the
  read observer, the session hook (at a prompt) and the finish hook each
  record it after the hook has answered, under operator control and with the
  adapter unavailable as well, and a target worktree's permission hook records
  it after writing its decision. A heartbeat that fails says so on standard
  error and changes no answer. The hook that carries it takes the heartbeat's
  time, which grows with the resident's log. A test gate and a bounded probe
  drop the store's binding, so the hooks a suite runs against its fixtures
  record nothing in the session's resident; a suite run directly from a shell
  bound to one still does.
- **The writer reservation.** One session writes a worktree at a time. A
  session refused by another's reservation may run
  `node scripts/harness.mjs writer --show` to see the holder, and
  `node scripts/harness.mjs writer --release` when the holder is dead, each
  as that exact command with no pipe, redirect or other command beside it. A
  live holder is released only from an operator terminal, with
  `node scripts/harness.mjs writer --release --force`.
- **A dead holder.** A holder is dead when its recorded host process no
  longer exists, its process id now names a process started at another time,
  or the process table shows it a zombie (a state beginning with `Z`). The
  next write dispatch reclaims a dead holder's reservation itself and logs
  the reclaim in `writer-events.jsonl`; a holder of unknown liveness is
  released from an operator terminal without `--force`.
- **The release at a stop.** Claude's finish hook releases the session's
  reservation at every stop, and its next guarded call reserves it again. A
  Codex session releases its own reservation and journals `dispatchStopped`
  when a `release close --publish` attempt ends before it completes, and when
  a turn ends without a continuation once its prompt hook has been observed;
  the retried close reserves it again before it moves `main`, and with no
  built runtime it refuses while another session's reservation is there; the
  next prompt of a dispatch still awaiting its completion event reserves it
  again, and a foreign holder at that prompt is named in its context.
- **A denied activation.** When the host denies a step after
  `worktree start` creates an order's worktree, or a registered target's
  pair, whether a write, the spawn of its activation or a denial its
  bootstrap reports on either output stream, the start puts back the records
  it moved out of `main`, removes each worktree and branch it created, and
  appends what it did, and any step it could not undo, to
  `docs/control/local/worktree-start-denials.jsonl`. A worktree holding a
  record it could not put back is kept, and a retry of a pending target start
  keeps what its earlier attempt made. A start the host refuses before
  anything is made says so and names the grant to request.
- **A fork's `gh`.** In a clone whose `origin` and `upstream` remotes name
  different repositories and whose gh default is unset, gh sends a command that
  names no repository to `upstream` without saying so. The hook refuses such a
  `gh pr` or `gh issue` command, naming `-R <origin>`, in the clone the command
  runs in, including after a session's `cd` has moved it. It admits the command
  with a value for `-R` or `--repo`, with `GH_REPO=` and a value in the command,
  with a pull request or issue URL as its selector, and once `gh repo set-default`
  has set a default, which gh stores as `remote.<name>.gh-resolved` and `gh repo
  set-default --view` reports. `gh repo set-default`, `gh auth` and `gh --version`
  reach no pull request or issue, and a clone with one remote sees no change. The
  judgment reads the command as written: a script that calls `gh` is unobserved,
  and a clone whose remotes cannot be read is admitted with one advisory.

  Two remotes are one repository only when their hosts, owners and names all
  match, and the hook reads a host only as far as its spelling establishes the
  server, because it cannot read an SSH configuration or which servers gh is signed
  in to. So an SSH alias spelled from `github.com`, such as `github.com-work`, is
  `github.com`, but any other alias, or the same owner and name on another server,
  is refused until the command names one. On two
  servers, name one with `-R`: `gh repo set-default origin` fails there, and the
  refusal does not offer it. An alias with no dot is named by owner and name alone,
  which gh takes to its default host, so where that alias is another server, name
  the server in `-R`. An upstream gh cannot reach, on GitLab.com, Bitbucket or
  Codeberg or in a form it cannot read as a repository, leaves gh with `origin`, so
  the command is admitted. An origin of either kind, such as a local path or a
  subgroup, leaves gh only `upstream`, so the refusal stands and names `-R
  <upstream>` alone. A self-hosted forge cannot be told from a GitHub server, so
  there too the refusal stands, and `-R <origin>` is the way past it.
- **A question.** An unprefixed operator message that ends in a question mark
  is journaled with the class `question`, by its form alone. Claude's hook
  adds a note to that turn: the next message answers it, with the evidence,
  either why the current course is right or what the question changes and
  what the session will now do differently, and the session keeps working;
  an action the message also asks for, a pause included, is done. Under Codex
  the role text carries the same two answers. A question records no rule
  (§Planning in this instance, the `Rules recorded` block).
- **Codex after compaction.** The Codex prompt hook keeps each operator
  message of a dispatched session, cut at 64 KiB, in the session's
  `<key>.codex-messages.jsonl` beside its journal. After a compaction the
  restored context carries the unfinished task and then every one of those
  messages since the dispatch began, verbatim and oldest first, each bounded
  only when it was captured. The first stop after a compaction journals a
  `compactionProbe` row naming the first assistant message after the latest
  compaction before that stop, read from the turn's transcript, or the stop's
  own last message labelled `stop-last-message`; an earlier compaction in the
  same turn has no separate sample.
- **Quiet advisories.** A shell command that uses control syntax, a dynamic
  substitution or a working-directory change is judged by host permissions;
  the hook journals that classification and shows no message. A refused
  command's message is unchanged.
- **Your own hooks.** A hook of this instance's is added through the
  committed fragment `.claude/settings.instance.json`, which emit merges
  after the kit's hooks for its event, and never by editing the generated
  settings, which a re-emit rewrites. The fragment takes no hook under
  `PreToolUse`, where the host runs a call such a hook rewrites without
  showing it to the guards above, nor under `SubagentStop` or
  `UserPromptSubmit` (§Extending this instance).
- **A blocked turn.** When only the operator can clear what blocks a session,
  every role's text says to state the block and the one line that clears it
  in a single message and end the turn, since the host holds a `!` command
  the operator types until the turn ends.

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
bundle under `.claude/` (`.claude/harness-manifest.json` among them), and
under `.agents/` and `.codex/` for a host the destination elects or its
record shows (§Features), `package.json`, `package-lock.json`, `dotln.config.example.json`,
`UPSTREAM.md`, the license files, `THIRD_PARTY_NOTICES`, `docs/product/07-execution-guide.md`,
`docs/product/operator-reference.md`, `docs/product/08-publication-compiler.md`, `docs/PLAYBOOK.md`, this guide
(`docs/KIT.md`), the operator commands page generated from it
(`docs/OPERATOR.md`) and
`docs/publication/implementation-overlay-template.md`. Three of the scripts'
files are another project's, carried byte for byte so that the lifecycle
reads Markdown before anything is installed: Prettier's Markdown plugin, its
license and its third-party notices, under `scripts/lib/vendor/`.
`THIRD_PARTY_NOTICES` at the root names them with their version, and
`scripts/lib/vendored-parser.json` records the hash of each; the checks of
this instance's own text leave out exactly the files that record proves, so a
changed copy is screened as any file is
([decision](evidence/WO-276/decisions.md#wo-276-d032--the-carried-parser-is-proven-by-recorded-hash-and-left-out-of-the-screens-by-its-bytes)). A kit update replaces
unmodified kit files; a re-emit regenerates the bundle from
the runtime. Instance files are yours: `dotln.config.json`, `docs/control/`,
`docs/work-orders/`, `docs/evidence/`, `docs/verifications/`,
`docs/final-reviews/`, `docs/workstreams/`, `docs/repositories/`,
`docs/planning/`, the product overlay and the build overlay, `FOR-CORE.md`
(seeded once with no entry and never rewritten by a refresh), `CLAUDE.md`
(its generated harness block is checked by `node scripts/harness.mjs check`
through the listed harness manifest, changed by an update only through an
explicitly opted-in phrase action),
`AI-HARNESS-SECURITY.md`, `README.md`, `.gitignore`, `.gitattributes` (seeded
once where the instance has none, with the line `* -text` that keeps Git from
converting the line endings of the files the kit verifies by their bytes; add
the instance's own attributes under it) and every root README the
export seeded once, the workstream and repository-profile conventions
included; their upstream sources stay under `scripts/kit/` for a later
revision to refresh. The generated `.claude/settings.json`, hooks, skills and
Codex files are kit files a re-emit rewrites; the hooks and permission rules
every checkout of this instance should carry go in the committed fragment
that emit merges (§Extending this instance), and one machine's Claude Code
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
step 1 or on the update branch, and bootstrap never writes it. The starter
refresh writes every seed the export writes that the starter lacks, at the
export's bytes and the lineage index rendered from the starter's own ledger,
and never overwrites a present one; it removes a seed the kit retired
(`docs/control/doc-ceilings.json`) while its bytes are the kit's rendering
and keeps a customized one, naming why in `keptSeeds`; its summary names
`seeds added:` and `seeds removed:`. The template seeds keep their own rules
below ([decision](evidence/WO-258/decisions.md#wo-258-d012)).

The optional committed `contributions.operatorAuthor` is one public
`Name <email>` author identity exempt from contributor sign-off, and
`contributions.authors` lists further ones, each in that form and each
once: the people whose commits are this instance's own
([decision](evidence/WO-276/decisions.md#wo-276-d087--part-m-as-built-a-target-order-closes-when-its-base-holds-the-reviewed-change-by-ancestry-a-squash-or-a-rebase-or-under-a-commit-named-for-it-the-instance-lists-its-authors-and-the-drive-settles-a-targets-own-release)). A commit by an author in neither needs the sign-off
trailer, and omitting both gives no author an exemption. A malformed entry
of the list is refused when the configuration loads, by its index. The kit
supplies no identity, and local Git identity configuration never grants one;
changing either declaration is a reviewed instance decision. Historical order IDs come from this instance's `historicalWorkOrders`
declaration.

**What each worker runs is this instance's to say**
([decision](evidence/WO-276/decisions.md#wo-276-d077--worker-models-as-redesigned-on-the-operators-direction-models-are-rows-of-data-workers-are-names-an-instance-binds-to-them-one-resolver-and-two-commands-answer-every-launch-and-no-worker-definition-hook-or-sentence-names-a-model)). DotLn names three things. A *model* is a row: the
provider that launches it (`claude` or `codex`), its exact id, the effort it
runs at where a launch names none and, for Claude, the model family a
session's own launch takes. A *worker* is a name bound, for each provider it
runs on, to a model, or to a model at an effort of its own. A *provider* is a
launcher the kit has. The kit ships six models (`opus`, `fable` and
`sonnet` for Claude, `sol`, `astra` and `luna` for Codex) and four workers:
`default`, which a launch that names nothing and every driven phase runs;
`advanced`, each provider's stronger model, for work the operator asks it
for; `verifier`, which a driven independent verification runs; and `judge`,
which the resident's always-on judge runs where a bind names no model. `npm run worker -- list` prints
the table this instance has, with what each name runs and where each value was
written, and `npm run worker -- show <name>` prints what one name runs and how
this session launches it.

The optional `workers` section of `dotln.config.json` holds this instance's
workers and nothing else, each a name, an optional `description` and, for a
provider, a model's name or a model with an effort:

```json
"workers": {
  "default": { "claude": "opus", "codex": "sol" },
  "advanced": { "claude": "fable", "codex": "astra" },
  "night-review": {
    "description": "Reviews that run unattended.",
    "codex": { "model": "astra", "effort": "high" }
  }
}
```

An entry with the name of a kit worker restates only the bindings it writes
and keeps the others; any other name is a worker of this instance's own, and
there may be any number. The models live in an optional `dotln.models.json`
beside the configuration, which is this instance's file and no kit path, so
an update never touches it:

```json
{
  "schemaVersion": 1,
  "models": {
    "small": { "provider": "claude", "id": "<the exact id>", "effort": "high", "family": "<the family>" }
  },
  "prices": {}
}
```

A row adds a model, and a row with a kit model's name replaces the kit's row
whole, which is how an instance follows a new model id before the kit does.
Whatever neither file states, the kit's own list supplies
(`packages/skeleton/src/worker-models.mjs`, the one place the kit names a
model that a worker runs), so an instance that states nothing launches the kit's defaults.

A name means one thing. A worker with a model's name, a model whose id is
also a name, two rows of one provider with one id, a binding to a model that
is not listed or is another provider's, and an effort a provider does not
take (`low`, `medium`, `high`, `xhigh`, `max`) are refused when the
configuration loads, naming the entry at fault by its file and key; an id is
this instance's to get right, in the form a worker definition carries (at
most 100 lower-case letters, digits, dots and hyphens, beginning with a
letter). A row may name a provider the kit has no launcher for: it is listed
as such, held to the same form of id and to an effort of one word, and
refused where a launch of it would be resolved. A launch takes a worker's
name, a model's name or a model's exact id (`--model` on `npm run worker --
review`, `npm run plan -- refute` and `npm run entropy -- review`, with
`--effort` for that one launch; the refuter's direct form also takes
`--provider` where a worker runs on several and no session says which), and
an unknown name is answered with every name the instance has. No code
matches a word loosely: turning what the operator said into a name is the
session's judgment over the listing, and it asks where the words fit no entry
or several. The two files are edited on main or in an order's worktree: a
planning branch takes documents only, so a planning session that hears the
operator's choices records them for that edit and does not make it.

After an edit run `node scripts/harness.mjs emit`. The one worker definition
and the phase definitions under `.claude/agents/` hold what `default` and
`verifier` resolve to for Claude, the session hook is given the table's
names (so that a dispatch line may close with them, as in `resume: next
night-review`), and `node scripts/harness.mjs check` compares them with the
two files from then on, so a definition emitted from them is neither drift
nor, to an update or to `node scripts/launchpad.mjs verify`, a local
modification. No role's text names a model, so none changes. How a launch
reaches its model is the provider's: the kit's command-line launches (the
review helper, the refuter, the entropy reviewer, a drive's phases) pass the
exact id and effort; a Codex session's spawn passes them itself and opens its
brief with the worker rules `show` prints; a Claude session launches the one
`dotln-worker` definition, as it stands for the model that definition holds
and otherwise with the model's family and effort, which the host resolves to
a model, so `show` marks that launch as not exact and the record carries the
model the host reports. A model with no family is launched by the kit's
command only. A launch that fails names where this instance wrote its model.
The record says what ran: a launch's attestation carries the model id and the
effort it was given, and a receipt's worker type names the provider's
launcher (`dotln-worker`, `codex-spawn-agent`); the two per-model types an
earlier kit recorded still read.

`npm run meta -- --usage` prints what the recorded sessions used, in tokens by
class (input no cache served, input read from a cache, input written to one,
and output, which do not overlap), for each order and for each calendar day of
this machine's own time zone; `--since <YYYY-MM-DD>` bounds the days and
`--json` prints the same report for a program. It reads every observation in
this checkout's usage ledger, whichever orders the meter's own pages show, the
main checkout's too for an order in flight in its own worktree, and, for a
role of an order whose ledger rows hold no counters or are gone, the usage
copies retained when the order closed. A session is observed more than once,
each time counted from its start, so an observation is counted on the day it
was observed for what it adds to the one before: a session that runs past
midnight leaves on each day what that day's observations added, as finely as
it was observed. The hosts' counts only grow, so a later observation of a
session that counts less than an earlier one means the basis of the
measurement changed, and the report cannot tell how: it counts the session
from the fall on (the observation that fell whole on its day, later ones for
what they add on theirs), so the order's sum is still the last count, and the
line of every figure the session touches, its earlier days among them, says
that what it used on each day is not known. The meter and this report order a
session's observations alike, by when each was made, so a record written out
of turn changes neither. Totals that survive only in a closed order's snapshot
name no day and are not in the report. An observation that gave no count of
the dispatch (a collection that failed, a Copilot session's cumulative count)
is left out beside a measured one of the same session and otherwise stands on
its own day, and a line says how many of its observations were such. A class a
host reports none of reads `unknown`, never zero. The `prices` of `dotln.models.json` map
a model's exact id to this account's prices for the four classes (`uncachedInput`,
`cacheRead`, `cacheWrite`, `output`, in US dollars for a million tokens);
where it names the model a session's own events in the order's log attest, the
report multiplies each class once by its price and prints the result marked as
an estimate. For a model with no declared price, and for a session or a kit
launch whose model no record attests, it prints `unknown`, and so does a sum
that holds one of them. No price ships in the kit: an account's rates are its
own and change, an estimate is recomputed from the prices as declared now, and
a cost the host itself reported stays the figure of record
([decision](evidence/WO-276/decisions.md#wo-276-d069--part-j-as-built-an-instances-workers-section-decides-what-each-worker-runs-one-resolver-answers-every-reader-and-the-usage-report-gives-tokens-by-class-and-by-day-with-an-estimate-from-the-instances-own-prices)).

**Your orders live here.** `docs/work-orders/` holds the orders this
instance cuts, `docs/evidence/`, `docs/verifications/` and
`docs/final-reviews/` their records, and `docs/planning/` the passes that
cut them. The first planning pass is this instance's own: `npm run plan --
start <slug>` cuts its orders from its own sequence; the pre-drafted WO-001
is the only order the kit seeds, and no order of core's ever arrives in an
update. WO-001 establishes what this machine and the hosts it elects
support: it registers the local-terms list and checks the four files it
writes, its criterion 3 records the printed status, a refuse-mode match fixed
before filing and each context-mode match read, and it runs the review ladder
every order runs
([the order](evidence/WO-258/decisions.md#wo-258-d011);
[the two classes](evidence/WO-276/decisions.md#wo-276-d008--the-lists-two-classes-and-the-runs-a-match-joins-across-step-a1)). §Planning in this instance names the commands a planning pass runs
here and the seeds it reads.

## Extending this instance

The kit runs none of your tools and does not learn what they are. It gives
them a place it will never touch, a committed way to add hooks and permission
rules, a section of the configuration and three outputs to read
([decision](evidence/WO-276/decisions.md#wo-276-d074--part-k-as-built-one-root-that-is-the-instances-by-guarantee-a-settings-fragment-that-only-adds-and-takes-no-pretooluse-hook-and-what-the-host-was-observed-to-do)).

**One root is yours by guarantee: `extensions/`.** No kit file is under it
and none will be: the kit's manifest refuses a path there, under any letter
case, since a file system that ignores case holds `Extensions/` as the same
directory; an update plans nothing there; emit writes nothing there; no
document root and no declared kit action may name it. The format task leaves
it out, and so do the kit's document checks (links, kinds, entry points, the
pattern screen), its structural checks and its comment check. An order whose
every change lies under it, with the order's own documents and records, owes
no kit suite: the closeout selection prints the document gate alone and says
why, and the order's criteria name the command that tests your tool. A path
anywhere else carries no such promise, since a later release may add a file
beside yours and the kit's checks walk whole trees.

Some things still read the root. The three screens for what must not leave a
repository do: the local-terms screen, the verbatim screen, and the
private-path screen, which reads every file there, Markdown by the rule for
a document and any other file for a home directory's path. And what follows
an order's whole change follows it there: its checkpoints, the review of its
change, and the gate's record of the tree and of the code it ran on, so an
edit under the root after a complete run is a change to this repository's
code, and an order that still owes that run pays it again.

A tool you already keep elsewhere keeps working. What breaks is only what
this section rules out: a file of yours at a path a later release claims, a
hook written into the generated settings, a skill or agent named `dotln-…`.
Moving a tool under the root is your choice.

**Your hooks and permission rules are a committed fragment,
`.claude/settings.instance.json`.** `node scripts/harness.mjs emit` merges
it into the `.claude/settings.json` it writes and `check` compares the
merged text, so an update plans the merged settings as this instance's own
emit and `node scripts/launchpad.mjs verify` counts them as written by it.
A target worktree's bundle takes the fragment as it stands when that bundle
is written, at the worktree's start, and its check compares the bundle with
what was installed then: after editing the fragment, `node
scripts/harness.mjs emit --target <worktree>` writes a standing worktree's
bundle again. The merge only adds: your hooks follow the kit's for their
event, your rules follow the kit's in their list, and every entry the kit
emits stays as emitted. With the fragment removed, emit writes the bytes it
writes for an instance that never had one.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${DOTLN_LAUNCHPAD:-$CLAUDE_PROJECT_DIR}/extensions/hooks/after-edit.mjs\"",
            "timeout": 30
          }
        ]
      }
    ]
  },
  "permissions": { "deny": ["Bash(extensions/tools/deploy *)"] }
}
```

- What it may hold. `hooks`, under `PermissionDenied`, `PostToolUse`,
  `PostToolUseFailure`, `SessionStart` and `Stop`, the events at which the
  kit registers a hook of its own and only observes; each group a `matcher`
  string where it has one and its `hooks`; each hook a `type` of
  `command`, its `command` and a `timeout` in whole seconds where it has
  one. `permissions`, as `allow`, `ask` and `deny` lists of rules. Emit
  refuses anything else and names the key: a key the kit emits, which the
  fragment would replace (`autoMemoryEnabled`, `attribution`); a key the
  merge does not define (`env`, `disableAllHooks`,
  `permissions.defaultMode`, a hook's `async`); `null` where a list
  belongs; a hook the kit registers itself, registered again; a rule the
  kit emits, written into another list, where it would countermand the
  kit's; and a command or a rule that holds a character a reader cannot see.
  A wider rule of your own that covers one of the kit's allow rules is your
  tightening and is taken. The shape is the kit's own entries' and no wider
  because the file is the kit's too: the host is documented to drop a
  settings file's other hooks over one malformed entry.
- No hook under `PreToolUse`, `SubagentStop` or `UserPromptSubmit`, the
  three events where an added hook's output could stand in for an answer of
  the kit's. On Claude Code 2.1.322 a `PreToolUse` hook that returns a
  rewritten input has the rewritten call run, and the kit's guards are shown
  only the call as it was first asked, so a hook there could turn an
  admitted call into a refused one unseen. At `SubagentStop` the kit itself
  refuses a worker's stop while its tasks run, and the host's documentation
  gives an added hook's `continue: false` precedence over that. A
  `UserPromptSubmit` hook that blocks or fails keeps a prompt from the
  session, `analysis:` and `operator override:` among them. A refusal of
  your own is a `permissions.deny` rule. The ignored
  `.claude/settings.local.json`, which emit does not merge, has the same
  powers on the same host: a `PreToolUse` hook there that rewrites a call
  runs a call no guard of the kit's judged, so write none that does.
- What an added rule or hook cannot do. A call a kit guard refuses stays
  refused beside an `allow` rule and beside a hook that allows it, and a
  call a deny rule names stays refused beside an `allow` rule: the host
  resolves several answers deny first, as its documentation says. Runs of
  the host showed both, the second with a deny rule added through the
  fragment; the decision this section links names them.
- In a target worktree the project directory is the target, where
  `extensions/` is not. A command that names a file of this instance
  reaches it through `DOTLN_LAUNCHPAD`, which a driven session's
  environment carries and an attended session has where you export it; the
  spelling above runs in both places.
- You own the tests of what you register. A hook that fails or is slow fails
  or slows every call it is registered for, and no kit suite runs it.
- An instance that elects no compiled harness has no emitted settings for
  a fragment to join; one it keeps all the same must still be a regular
  file. What belongs to one machine still belongs in the ignored local file.

**Your tools' settings live under `extensions` in `dotln.config.json`.**
The section must be an object. The kit returns it as written when it loads
the configuration and reads nothing in it, and no declared kit action adds a
field there.

**What a tool may read.** Three outputs are the ones to build on, and a
release that changes one says so in its Read before upgrading:

- the control log, by default `docs/control/orders/WO-NNN.jsonl`: one JSON
  object a line, each carrying `schemaVersion`, which a reader checks before it
  trusts the rest;
- `npm run resume -- status --json`: an object whose first key is
  `schemaVersion`; with `--all`, an array whose every element carries it,
  and which is empty, carrying none, where there is no order;
- the usage report, `npm run meta -- --usage --json` (§Kit files and
  instance files).

A tool that imports another kit module by path depends on a file the next
release may move. A wider surface waits for a tool that needs one, named in
an entry to core.

**Where each kind of extension goes.**

- Skills, agents and commands: beside the generated ones, under any name that
  does not begin `dotln-`, the names emit owns.
- Standing rules: in `CLAUDE.md`, outside the generated block.
- Dependencies: in a package of your own under `extensions/`, with its own
  lockfile, never in the kit's `package.json`, which an update replaces.
- Tests: named by the order that changes them, in its criteria, by a
  command that is not the kit's own. A criterion that holds the words `npm
  test` claims this repository's complete run, whatever directory the
  command is meant for; `npm --prefix extensions test`, or the test file
  itself, names yours.
- A target's checks: in its registration's gate (`repositories.<id>.gate`).
- A tool that prepares planning input: it writes outside the intake root,
  which is single-copy source that the words screen reads, and the planning
  dispatch names its file.

**What you send core is what blocks you.** §Planning in this instance gives
the rule. `FOR-CORE.md` holds every difficulty the kit gave this instance,
each entry saying whether it stops the next order; what an instance asks core
for is only what does stop it and has no working route here. A gap you built
a tool around has a route: its entry stays in the file, with `stopsNextOrder`
false, and is not sent.

## Taking upstream updates

The kit's guide is `docs/KIT.md`, a manifest-listed file carried by every kit
update. The root `README.md` is an instance seed, outside the manifest: a kit
update never replaces it. The starter refresh replaces an unedited seed README
with the current short front page and keeps a customized, missing or
non-regular README, reporting why in `keptSeeds`. You may keep or remove the
README release block as described in §Releases in this instance.

A release close runs its printed `--publish` command once; `--dry-run` is
optional when a prerequisite is in doubt. Before importing built modules, the
close entry prepares the verified carried runtime in a child process (core
builds its source runtime in a child). This keeps the compiler predicting a
starter update aligned with the exported runtime's own emit. Publication and
retry controls remain the same.

Preview before every update. From a clean DotLn core checkout at the commit
you want to take, with its pinned dependencies installed, run:

<!-- operator-commands aside: core's own update of the starter, not an instance's -->
```sh
node scripts/launchpad.mjs export --update /absolute/path/to/starter --preview
node scripts/launchpad.mjs export --update /absolute/path/to/starter
```

The preview and update share one plan. Each kit path is listed as `replace`,
`add`, `remove`, `refused` or `re-emitted`. A refusal names the local edit or instance-owned
collision and the prior manifest hash retained (none for a collision).
`replace` includes files whose bytes already match. The preview also names
the incoming core commit and tag, the declared runtime build snapshot before
and after, and the sibling receipt path it would write, or why no receipt
applies. A declared build hash identifies the harness snapshot; it does not
verify a locally edited runtime. An unreadable local snapshot is `unknown`.
The receipt filename is reserved only by the actual update, so its timestamp
can differ from an earlier preview.

A preview writes nothing to the destination, its pending manifest, core's
sibling receipts or core's sibling registry, except that its census re-stamps
a temporary root whose volume a reboot renumbered, in that root's own owner
record and ledger. It is not a receipt and does not
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
before committing it. One kind of kit file is rewritten by the instance's own
command, its emit: a generated harness surface (a surface the incoming emit
writes, or the harness manifest). Where such a file holds neither manifest's
bytes, the plan asks the instance's own `node scripts/harness.mjs check`, as
a child process and only then, and only where every compiled runtime file
the prior kit listed holds bytes a kit wrote, since the check loads that
runtime. Where the check passes, the bytes are that
emit's: the row reads `re-emitted: <path>`, the file is replaced, and the
emit the update ends with writes it again under the instance's
configuration. Where the check fails, nothing is installed there to run it
or a compiled runtime file differs, so that it was not run, the file is
refused as locally modified and the row says which
([decision](evidence/WO-276/decisions.md#wo-276-d065--part-i-as-built-an-updates-merge-keeps-the-instances-bytes-the-preview-lists-the-files-both-sides-changed-a-surface-the-instances-emit-wrote-is-re-emitted-and-every-spelling-of-a-worker-launch-counts);
[the runtime first](evidence/WO-276/decisions.md#wo-276-d174--kit-verification-and-an-updates-plan-compare-every-carried-compiled-runtime-file-before-any-of-the-instances-code-runs)).

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

**Sort the local-terms list before taking v1.0.0 or a later release.** From
v1.0.0 an entry with no marker no longer stops a gate, a publish or an
export: it is a context entry, which every screen lists by file and line for
the stage at hand to read, and passes. Before the release is taken, the list's
owner puts each entry that must never appear under a `refuse:` line, or marks
it `refuse:` on its own line (§First steps shows both classes and the shipped
example). Until then a stage's reading of the listed lines is all that stands
between such an entry and a commit
([decision](evidence/WO-276/decisions.md#wo-276-d008--the-lists-two-classes-and-the-runs-a-match-joins-across-step-a1)).

**Run the index once after taking v1.0.0, and start a resident through its
launcher.** From v1.0.0 the work-order index keeps what it observed in two
records, `docs/control/release-history.json` and
`docs/control/workstream-observations.json`, and commits no record of the
orders' cards. Run `npm run work-orders -- index` once after the update and
commit the two records with the regenerated pages; until then `npm run
work-orders -- index --check` fails naming that command. A resident is
started with `node scripts/resident.mjs`, the line `node
scripts/resident-bind.mjs` prints: the launcher hands it the documents a
mission check judges and the work-order cards. One started through the
package's own entry holds a mission check with no judgment and reports its
work orders unavailable, naming the launcher in both
([decision](evidence/WO-276/decisions.md#wo-276-d033--what-this-part-changes-in-the-ported-readers-one-build-free-source-reader-no-committed-cards-one-parse-a-document);
[the recorded hold](evidence/WO-276/decisions.md#wo-276-d170--a-resident-that-holds-no-reader-of-mission-documents-records-the-checks-failure-as-documents-unread-and-the-hold-names-the-launcher)).

**What else v1.0.0 changes for an instance.** The role roots and the worker
definitions are generated: the emit on the update branch rewrites them, and
nothing is asked of the instance. A host that only a discovery record showed
is off: elect it under `features` in `dotln.config.json` and run `node
scripts/harness.mjs emit` to keep its surfaces. A seeded first order that has
not run keeps its old text; take its authority, capability checklist,
deliverables and second and third criteria from
`scripts/kit/first-order.template.md`. The release seeds `.gitattributes`
where the instance has none; a clone whose line endings Git had already
converted runs `git add --renormalize .` once and commits what it changes.
The seeded repository-profile and workstream pages changed: the instance
keeps its own and finds the new text in this guide and in
`scripts/kit/repository-profile.template.md` and
`scripts/kit/workstream.template.md`. `npm run resume -- status --json`
prints `schemaVersion` as its first key. This release also changes rows of
the features page, which the instance renders from its own configuration, so
the update branch runs `npm run sync` after the emit and the lineage index,
as the steps below do
([what the update section owes](evidence/WO-276/decisions.md#wo-276-d163--follow-ups-in-standing-documents-sentences-the-kit-guides-update-section-is-said-to-carry-and-does-not-a-seeds-check-that-names-three-files-of-four-dated-accounts-a-stale-synopsis-and-four-passages-that-still-call-the-teammate-ready-rung-10);
[the rehearsed update](evidence/WO-276/decisions.md#wo-276-d164--the-second-reading-the-files-the-first-sixteen-readers-left-unread-and-an-update-from-the-previous-releases-kit-add-one-blocking-finding-three-readers-under-criterion-25-and-nineteen-follow-ups)).

Inside an instance, its own session takes a starter update on the operator's
word, never on a planning or entropy pass's own initiative (§Planning in this
instance): under a journaled `planning:` or `ideation:` dispatch or a pending
entropy dispatch, `update --finish`
and `update --publish` refuse unless the operator's in-session request is
recorded with `--operator-request --capture <ignored intake file>
--capture-hash sha256:<digest>`, or unless the instance elects
`features.auto-update-upstream`, its standing opt-out of that rule
([decision](evidence/WO-258/decisions.md#wo-258-d005)). The starter is Claude-only: an instance that has
Codex or Copilot on, by an election or by its attestations, sees that host's
surfaces as `remove` rows in the preview and in the merge, and the re-emit on
the update branch writes them back ([decision](evidence/WO-258/decisions.md#wo-258-d004)); a host that only a
discovery record showed is off from v1.0.0 on, and its surfaces stay
removed until the instance elects it ([decision](evidence/WO-276/decisions.md#wo-276-d057--part-g-as-judged-the-seeds-name-claude-code-alone-a-discovery-record-turns-no-host-on-the-operators-commands-are-a-generated-page-and-what-core-should-hear-is-one-file)). It previews the revision with that revision's own launchpad, run from a
temporary detached worktree under the ignored `.runtime/` directory. The
instance's launchpad knows only the kit paths of its export and refuses a
manifest naming a later one; the incoming launchpad knows every path it
ships. This example names the starter remote `upstream`:

<!-- operator-commands take-release: On your word in a plain session in `main`, never in a planning pass, read the release's Read before upgrading, preview the starter's revision, take it on a `chore/` branch through its own pull request, merge that with a merge commit and finish in `main`. -->
```sh
git config remote.upstream.tagOpt --no-tags
git fetch --no-tags upstream
git worktree add --detach .runtime/upstream-preview upstream/main
node .runtime/upstream-preview/scripts/launchpad.mjs preview --from upstream/main
git worktree remove .runtime/upstream-preview
```

The preview prints, above its file sections, one line for each floor the
incoming release's `package.json` declares (`engines.node`, `engines.git`)
that this host does not meet, naming the floor and what this host runs; with
both met it prints no such line. It still prints its plan and refuses
nothing, since a preview may be read on one machine for another; the
incoming tree's own `node scripts/doctor.mjs` gives that release's whole
host report ([decision](evidence/WO-276/decisions.md#wo-276-d060--part-h-as-built-the-host-report-a-kit-roots-host-check-sized-to-its-carried-tasks-the-previews-floor-lines-the-compilers-failure-and-the-attributes-seed);
how the report marks a fact it cannot read and what it withholds:
[decision](evidence/WO-276/decisions.md#wo-276-d131--the-repair-of-ver-002-ten-findings-in-code-each-closed-as-the-class-it-names)).

Before the kit's rows the preview lists the instance's own files that a merge
of the revision would meet changed on both sides: each file outside the
incoming manifest that this instance and the starter have both changed since
their merge base, or both added with different bytes. Each is a `both
changed: <path>` row under a line that names the base and says to keep this
instance's bytes when merging; with none it prints `instance files both sides
changed: none`, and where the clone holds no shared commit it says the base
cannot be read. Git may merge such a file in silence or stop on a conflict.
Either way the instance's bytes are the ones the merge keeps, and a closed
order's text is restored, never merged. A file only the starter changed or
added flows in as Git merges it and is not listed. The kit's own rows follow
the from-core plan above, the `re-emitted:` row among them
([decision](evidence/WO-276/decisions.md#wo-276-d065--part-i-as-built-an-updates-merge-keeps-the-instances-bytes-the-preview-lists-the-files-both-sides-changed-a-surface-the-instances-emit-wrote-is-re-emitted-and-every-spelling-of-a-worker-launch-counts)).

Set `remote.upstream.tagOpt` once so later ordinary fetches also omit tags.
An explicit `git fetch upstream --tags` overrides `remote.upstream.tagOpt
--no-tags`; fetch plain unless you intend to bring in all starter tags. To
select one starter tag without adding it to the instance's tags, use the
ref-specific example below.
Starter tags identify the starter's export, not this instance's release baseline;
the local release commands exclude annotated tags with the starter's recorded
message. To preview a named starter release, fetch it into a non-tag ref and
use that ref for both the detached worktree and the preview revision:

<!-- operator-commands aside: a named starter release's preview, the alternative to the step's preview of the starter's main -->
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
Of the files outside the manifests the preview lists those both sides
changed, above; any other instance file a merge changes is one the starter
alone changed.
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
`main`, the session creates a `chore/<slug>` branch (for example
`chore/starter-update`), merges the previewed revision into it (a fast-forward
when `main` has no commits of its own), keeps this instance's bytes for each
file the preview listed as changed on both sides, runs `node
scripts/harness.mjs emit`, `node scripts/lineage.mjs index` and `npm run
sync`, and commits the regenerated bytes on that update branch. This
includes a lineage index missing from an older export, and the derived
pages a release changes, which the instance's first document gate otherwise
fails naming the sync. It publishes the branch with
`node scripts/launchpad.mjs update --publish --from <revision> --title <title>
--body-file <path>`.
That command refuses on `main`, off a `chore/<slug>` branch and with uncommitted
changes, and until the update is whole: `UPSTREAM.md` and `KIT-MANIFEST.json`
name one commit, neither the one they named where the branch left `main` nor the
one `main` names now, and `node scripts/harness.mjs check` and
`node scripts/lineage.mjs index --check` pass.

The publish also judges the update's own merge, before any push: the oldest
commit in which a line that holds the starter's revision meets one of this
instance's that does not, wherever on the branch it stands. `--from
<revision>` says which revision the branch merged, the ref or commit the
preview was given, and the command below passes it; the commit must be one
a fetch from a remote other than `origin` left a ref for, since a commit made
here by a rebase or a copy is not the starter's. Without `--from` the publish
reads the fetch for the revision: the starter remote's `main` (`upstream/main`
above; the `main` of any remote but `origin`) or a ref under
`refs/upstream-releases/`. Another branch of another remote is not read as
the starter's unless `--from` names it, since a mirror or a colleague's fork
holds this branch's own commits under such a name; and where the refs give a
commit whose own history joins a line `main` holds, which is either the
starter's own merge or this branch's merge as another remote holds it, the
publish asks for `--from`. A revision neither route names is refused. So are
a squash or a copy of its files, a rebased update branch, a merge that joins
more than two lines, a revision merged in two places and a second revision
of the starter's on one branch, however it arrived; each refusal says what
to do.

A file both sides changed must hold this instance's bytes at the branch's
tip: the merge commit held them, or a later commit put them back and nothing
has changed the file since. Otherwise the publish refuses, naming each file,
the `git checkout <commit> -- <path>` command that restores it and `--take
<path>`, which admits one named file whose merged bytes you mean to keep; a
publish prints each as `taken: <path>`. Merging `main` into the branch
afterwards does not change the commit judged. This instance's bytes are then
those of the newest commit of `main`, or of `origin`'s `main`, that the
branch holds, where that commit changed the file again; the restore names
that commit by its id, and a later commit of `main` the branch has not taken
in changes nothing. A file that the branch's own side of the merge and `main`
have both changed since has no one commit to restore from: the refusal says
so, and the file is set by hand and taken. Where an earlier update reached
`main` by a squash merge, `main` holds none of the starter's commits and the
base is older than that update, so its changes read as this instance's; the
refusal says that too, and such a file is taken. A clone too shallow to hold
the merge base is refused with that cause and the fetch that mends it; a
whole clone whose history shares no commit with the starter's is refused as
that, since nothing then tells this instance's changes from the starter's
([decision](evidence/WO-276/decisions.md#wo-276-d065--part-i-as-built-an-updates-merge-keeps-the-instances-bytes-the-preview-lists-the-files-both-sides-changed-a-surface-the-instances-emit-wrote-is-re-emitted-and-every-spelling-of-a-worker-launch-counts),
[its later judgment](evidence/WO-276/decisions.md#wo-276-d068--the-thirteenth-critic-the-sixth-attack-on-part-i-and-rolling-review-21-judged-the-publish-takes-the-revision-it-is-told-and-the-instances-bytes-are-those-of-the-commits-the-branch-holds)).

The publish then does what `plan publish`
does (§Planning in this instance): it lints the title and body, pushes the branch
to `origin`, opens a pull request against `main` and prints its URL. The operator
reviews and merges with a merge commit, so `main` keeps the starter's history
and the next update does not apply this one again. A session in a fork that still
spells raw `gh` names the repository with `-R <fork>`, or runs `gh repo
set-default origin` once in the clone (§Hooks). The session then switches
back to clean `main` and runs `node scripts/launchpad.mjs update --finish`.
That command reads `origin`'s `main` first and fetches nothing when the checkout
already holds it; otherwise it downloads only what the checkout lacks. It checks
the fast-forward before changing the checkout, advances `main` to `origin/main`
and runs bootstrap; main stays ready for the next worktree. It refuses a dirty
tree, a non-fast-forward or a checkout other than `main`, naming the fact. A read
or fetch past its bound, ten minutes unless `--fetch-timeout <seconds>` says
otherwise, is refused with the checkout unchanged and prints the by-hand finish:
`git fetch origin main`, `git merge --ff-only origin/main` and `node
scripts/bootstrap.mjs`.

<!-- operator-commands take-release -->
```sh
git switch -c chore/starter-update
git merge upstream/main
node scripts/harness.mjs emit
node scripts/lineage.mjs index
npm run sync
git add -A
git commit -m "Take the starter update"
node scripts/launchpad.mjs update --publish --from upstream/main --title "<title>" --body-file <path>
```

<!-- operator-commands take-release -->
```sh
git switch main
node scripts/launchpad.mjs update --finish
```
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

<!-- operator-commands aside: the starter's re-emit after core's update of it -->
```sh
node scripts/harness.mjs emit
```

Review that re-emit with this instance's configuration and overlay. Updates
flow from core into the starter as a reviewed change, then from the starter
into forks through each fork's update pull request and its re-emit.
An agent running the update needs its destination inside a granted write root;
an order naming a destination alone does not grant it.

## Opting in to instance actions

By default, a from-core update (`export --update`) leaves instance files
byte-identical and only prints the actions for you to carry out; a starter
update taken by a Git merge can change an instance file that both sides
changed, which [Taking upstream updates](#taking-upstream-updates) covers
([decision](evidence/WO-276/decisions.md#wo-276-d065--part-i-as-built-an-updates-merge-keeps-the-instances-bytes-the-preview-lists-the-files-both-sides-changed-a-surface-the-instances-emit-wrote-is-re-emitted-and-every-spelling-of-a-worker-launch-counts)). To apply the kit's declared mechanical actions,
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
the closing order's own roots: those its worktree's ledger registered and its
integration stashes. This checkout's other registered roots, other orders'
retained lanes and the system temporary directory are the host-wide remainder.
`plan start` prunes them, so expired roots outside every close's scope leave
at the next planning pass; while a gate holds the host lanes it prints the
read-only census instead, and `harness prune --apply` removes them on demand.
Both prunes are bounded steps under `prune.startBudgetMs` in
`docs/control/budgets.json`, 1,800,000 ms (0 h 30 min) when unset and
unbounded when null, so routine cleanup finishes in the run that starts it
unless a backlog outlasts thirty minutes.
The temporary roots go first, listed in batches of 64 entries between asks of
the budget and judged one at a time; the snapshots, advisories, claims,
caches, lanes and stashes follow with what the budget leaves. Every walk, byte
inventory and deletion of a candidate asks the budget as it goes: before each
directory it lists and each entry it reads or deletes, a planned snapshot's,
cache's or lane's permission walk and deletion included, and before each tree
listing and each batch of 32 objects of a stash's inventory. A shell claim's
retirement and a stash's drop, each a few fixed steps that must finish
together, are asked about once, before they start. The ledger's
retirement after a prune that was not stopped is the prune's closing
bookkeeping and is not bounded.
An item cut short is kept as `budget`, and an apply the budget stopped prints
`removed N; remaining M; resume with node scripts/harness.mjs prune --apply`
and goes on.
`harness prune --apply` sets no budget and finishes the remainder. A kit-owned
root is judged and removed on its owner record, with no file read, and the
report names each removal's proof; only an expired `closed-journal` root, whose proof is kept
beside its order's lane, and a retained lane, stash, snapshot, advisory or
cache the plan deletes are byte-inventoried first. One process-table reading
serves every temporary root's owner-liveness judgment, and a worktree's writer
is read at most once a second; the plan's own writer read, each pre-delete
check's, the advisories' and shell claims' owner checks, one by one, and an
apply's lane lease, for its own registration, read the table again. An entry inside a kit-owned root that its owner
cannot read is repaired before removal, and what a judgment granted to look
inside a root it keeps is put back; an entry that cannot be repaired keeps its
root as `restricted-entry` with its path, as an unreadable owner record does,
and none of these stops a prune or a close. A session
that needs expired or retained roots removed runs `node scripts/harness.mjs
prune --apply` itself under host permissions and records its receipt; it
hands the printed command to the operator only after a recorded host denial
of that exact command. The router, which writes nothing, runs no prune: the
phase session it launches does, under the same rule. The update
preview's census is limited to this repository. The close
receipt records candidates, removals, retentions and blockers.
Before removing an order's worktree, the close moves what its sessions
recorded, the session journals and other `*.jsonl` logs, session `*.json`
states, the gate index `checks.json`, `suite-success/` and `deadlines/`, into
`docs/control/local/retained/<WO>/harness/`. That lane is ignored local
material, never committed, of the `closed-journal` class; gate captures,
targets, excludes, the writer, started markers and links stay with the
worktree. Its cleanup row records `journals: { lane, files, bytes, outcome }`.
A failed move keeps the worktree as a cleanup blocker with the retry command,
and a retried close merges into the lane. `plan failures` counts a closed
order's rows from its lane, and `harness usage <session>` reads a closed
session there. A registered target's close also owns what the kit wrote in
the target: what a session there recorded in `docs/control/local/harness/` and
the order's change reviews move into the same lane, beside the launchpad
worktree's; a writer directory the writer protocol proves released, the
`.runtime/.metadata_never_index` marker, the files of a
`.runtime/harness/<hash>` snapshot the kit installed, and the temporary-root
ledger are deleted, the roots that ledger registers carried in the close
record for the close's prune. The ledger goes last, just before Git removes
the worktree, and is written back as it was if that removal stops, so a root
it registers stays prunable while the target stands. A lane or writer
directory reached through a link, such as a tracked link to a directory
elsewhere, is not the target's and stays where the link points. A snapshot counts as the
kit's by its content, whichever runtime installed it, never by its name: each
file must match what the launchpad's current runtime would install, or the
record `.dotln-snapshot.json` every installer now writes into a new snapshot,
or, for one installed before records, the snapshot's own package files with
the file list its release pinned, which the kit keeps for v0.83.0 to
v0.111.1. A snapshot from a release before v0.83.0 is refused as undeclared,
since its name covers only its pinned files. A held writer
stops the close before anything is moved or deleted, and any other file
there, such as an operator note or a stray `.env`, is judged as undeclared
material as before; the target cleanup row's `residue` names what moved and
what was deleted. Remove undeclared output from this launchpad session by the
target's path, never through a session or writer in the target. Its seven
timed steps cover prerequisites, runtime, worktree removal, publication,
starter refresh, prune and recording. The worktree-removal row's `children`
say what that step spent its own time on, within its duration: `base-fetch`,
`disposable-deletion` with its files and bytes, `finder-metadata`,
`journal-retention`, `git-worktree-remove`, `branch-delete` and
`preservation`. A close that stops records `blocker: { class, step, message
}`, classed where the refusal is raised as `undeclared-ignored-material`,
`not-clean`, `writer-held`, `preservation-refused`,
`declared-root-unreadable`, `host-denied`, `base-fetch`, `foreign-tag`,
`starter-refresh`, `publication` or `other`, and its summary names the class.
`plan failures` reports the latest eight timed attempts' median total and
slowest step, and its `blockers` count stopped closes by class and by order;
a class that stopped three or more orders' closes in the window is printed
by `plan start` as `close blocker repeated: <class> across N orders`.
Retained-material output and removal
receipts use counts by class and digests. `--list-material` supplies paths
outside the admitted close commands, so host permissions decide it;
digest-bound inventory sidecars preserve the full removal proof for retries. A blocker
keeps the same close retry command. A suite's end removes the fixtures that
suite registered under the gate when it passed and retains a failed or stopped
suite's for its diagnosis window, which starts then, including standalone
captures and scratch owned by those suites; the gate's end finishes what a
suite left. Every gate-owned root is accounted for; live workers,
null retention, reusable caches and independent coordination remain protected.
Repeating completion does not restart the diagnosis window.
Session completion removes only its own
scratch and dead captures after writer release and background work ends. Live
or uncertain owners and another worktree's lanes or writer remain protected.
An ordinary Claude Stop ends a turn; scratch survives until the session or its
dispatch has an observed end. Physical ownership markers are excluded from
fixture copies and seed commits. A marker names its directory by token and
inode: when a reboot renumbers a volume, a root whose owner's ledger registers
that token at that path is re-stamped and ledgered as `device-renumbered`
rather than refused, and a root whose owner repository is gone, as after a
close removed its checkout, is re-stamped on its marker's word, that token
with that inode, and judged by its class and window. A removal first moves the root aside within its parent
and deletes it only when the moved directory still carries that token and
inode; one a stop left aside as `dotln-removing-<token>` is finished by the
next prune, a root found inside its parent's aside is bound through the
parent and its registration ends with it, and the empty directory a stop
between deleting the owner record and the directory leaves is removed with
`rmdir`. A registration nested in a parent that sits aside waits while the
parent is there, whichever repository's ledger recorded that move. Invalid nested metadata retains the tree and
reports a cleanup blocker.
Global apply shares the host lane lock; no daemon or host-memory exception is
installed. `worktree start` creates the worktree without running a prune census;
`plan start` applies the prune and update preview prints the census.
Nested suite commands retain their outer gate's cleanup ownership across copied
repositories. Creator teardown waits only for a gate that can read its ledger.

Every role's `dispatches` entry in `docs/control/budgets.json` carries
`wallClockMs` and `completeRuns`; missing keys and null disable that bound.
`wallClockMs` bounds the time a phase worked, not the time since its
dispatch: a gap in the journals of the phase's sessions that begins at a
turn's end and is longer than ten minutes counts for nothing, a tool call
counts from its start to its end however long it runs, and every other span
counts, so an order paused overnight is not refused the next morning for the
hours it sat. The standing prints the worked time and, where the two differ,
the elapsed time beside it. A phase on a host whose tool calls reach no hook
(Codex) leaves nothing in its journal while it works and reads elapsed time
([decision](evidence/WO-276/decisions.md#wo-276-d102--the-attack-on-steps-p1-and-p6-six-findings-tool-rows-name-their-call-so-a-calls-rows-pair-exactly-a-host-that-journals-no-tool-call-reads-elapsed-time-and-a-dispatch-names-an-order-by-its-line)).
`dispatches.executor.repair` overrides the executor's bounds for `resume: fix`.
The kit exports `local-median` for implementation, verification, final review
and repair. Each consumer derives max(4 times its own completed phase median,
8 h 0 min); without local history the bound is 8 h 0 min. History is cut off at
the dispatch's original start. No source-repository timing sample is exported.
Explicit numeric overrides and null retain their meanings; the complete-run
default is three. Planner, refuter, release close and router stay unset. A drive
also reads `drivenSessionCeiling`, four times `subagentCap` by default, and the
optional `drivenPhaseTimeoutMs`; null disables either. This instance owns its
budgets.
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
`npm run resume -- accept-overrun <wallClockMs|completeRuns|subagentCap>
--ceiling <value> --reason <text> --capture <path> --capture-hash sha256:<digest>
<actor-flags>` yourself with your actual actor attestation. The executor can
record that authorization while keeping its writer. No exact phrase, session
exit or manual operator command is required; diagnose and repair script errors
in the same session. Without operator authorization the bound still holds.
An operator may also authorize a run for as long as needed before it begins,
in ordinary language. Record `--ceiling unlimited` for both `wallClockMs` and
`completeRuns` with that capture. Null acceptance ceilings lift those two
limits until the current phase completes; they preserve timing and run counts.
`subagentCap` is the third metric, for an operator who authorizes more workers
for one dispatch: its base is the budgets file's top-level `subagentCap`, its
ceiling a whole number or `unlimited`, and the hook, the usage readback, the
review helper's own count and a driven session's ceiling all read the accepted
cap for that dispatch, so no session edits `docs/control/budgets.json` for one
order and another order's dispatch still reads the file's value
([decision](evidence/WO-276/decisions.md#wo-276-d016--a-cap-accepted-for-one-dispatch-is-read-by-every-counter-of-that-dispatch-step-a11)).
The extension applies
only to the current order activation and phase, changes no verdict, and is
projected by `status --json`. The meter and `plan failures` show stops,
acceptances and the next same-order event with its delay. Operator-facing
durations use hours and minutes; numeric flags and machine records keep their
declared units.

A criterion no candidate can meet as written is recorded by the verifier or
the final reviewer, never the order's executor, with
`npm run resume -- defect <criterion> --class <class> --evidence <text>
<actor-flags>` in one of the five classes, and judged
`**Criterion <id>:** unmet, defective (<class>) by <ordinal>` with the
judge's evidence; the order goes on without a waiver, and `release prepare`
names each defective or waived criterion above a launchpad order's stored
pull-request body's process table for the operator to read before merging,
and the final review's pass refuses lines a later record left stale; a
target order's publications carry no such lines yet, so read its record
with `npm run resume -- status`. A waiver
(`npm run resume -- waive`) is recorded only from the operator's words
asking for that criterion's waiver. From the operator's captured words,
`npm run resume -- retract <ordinal> --reason <text> --capture <path>
--capture-hash sha256:<digest> <actor-flags>` undoes a waiver or defect
record, returning a closed order whose pull request is unmerged to repair,
and `npm run resume -- reopen-handoff` returns a handoff the operator
widened to its phase. A failed verification or final review needs a
readable findings block (`[]` when empty) and names what it failed on: a
plain `**Criterion <id>:** unmet` line, or a blocking entry in the block
with its `basis` and `reproduction`; an entry without them prints one
advisory and records, and a fail with no readable block is refused.

The optional `retention` object in
`docs/control/budgets.json` takes hours for `gate-fixture-passed` (0),
`gate-fixture-failed` (24), `session-scratch` (24), `worker-capture` (1),
`warm-fixture` (0 after stale), `legacy-backfill` (48), `coordination` (null)
and `closed-journal` (720, a closed order's journal lane; the window is this
instance's to change, and 0 removes lanes at the next prune).
Every key admits null, which preserves independently owned roots in that class.
A runtime ignores a key its kit does not define; the gate still refuses it.
Runtime directories inside gate fixtures share the fixture's lifetime; an
explicit per-root null still protects nested material. Application scratch uses
its own operation cleanup, with fixture ownership as the fallback for leftovers.
A nested cache with recorded fixture ownership also ends with the fixture.
Removing the owning repository does not pin an expired fixture; inaccessible
or invalid observations still retain it. Independent caches and coordination
keep their own protocols.
Without the block, these defaults apply. Exact helper spelling and host policy
still decide command admission; the kit does not change account settings.
An orphan without an observed end is retained on preview. Applying prune
records the first proven-dead observation and starts its full retention window;
it cannot be deleted by that same plan merely because it was created long ago.

## Document quality

Every committed document in this instance is one of three kinds, derived from
its path. A standing document (a product document, the sequence, a workstream,
a repository profile, the operator record, `CLAUDE.md`, a README) states what
is so for its reader: a change replaces the sentence that became wrong and links
the record behind it. A record (an order's decisions and evidence, a planning
pass document under `docs/planning/passes/`, a verification, a final review, a
refutation receipt, a release note) is dated, never rewritten and reached by
link. A generated page (the work-order index, the follow-up register, the
lineage index) changes only through its command. The kinds of the paths the
kit's own commands write are built in: filed proposal packets, entropy
receipts and the idea ledger are records, the follow-up feed and register and
the planning cost table are generated, and the carried release manifest
template is standing. Without a `docs/control/documents.json` of its own, the
instance's reader entry points are `CLAUDE.md`'s Start here (where a
`How to start: <path>.` line counts as a link), the skills' `Read:` lines,
the execution guide's cold-start order, §First steps and the front page
`README.md`, every line of it; the instance adds that file to name other
entry points or the documents whose kind their path does not say, and a
declared `entryPoints` list replaces the defaults, so an instance that
declares one lists its front page there under the kit's id `front-page`.
`npm run test:docs` refuses an entry point that names a record, the front
page excepted since it may link one, and reports a standing document no
entry point, link or program reaches. The same command screens this
instance's scripts as it screens the kit's: a non-test source under
`scripts/` or `packages/*/src/` that reads a heading, a fence, a table row, a
list item, a bold field label or JSON text with a pattern of its own is
refused by file and line, with the shared reader to call
(`scripts/lib/markdown-links.mjs`, or `JSON.parse`); the exceptions are the
ones `scripts/lib/markdown-screen.mjs` names
([decision](evidence/WO-276/decisions.md#wo-276-d031--part-b-begins-on-part-as-checkpoint-and-is-ported-from-the-earlier-worktree-whose-choices-are-restated-here)). `npm run plan -- documents` adds the read census from this
instance's session journals over the last five releases (a lower bound: Codex
reads are unobserved); a standing document nobody reaches and nobody read is
red-tagged by `plan start`, and the next planning pass removes it or folds it
into another with a recorded disposition. Nothing removes a document by itself,
and size never decides. No operator message is saved verbatim in a committed
artifact: a session paraphrases the operator in committed text and cites
the ignored intake capture by its SHA-256, and a quotation is written only
where the operator asks for that message to be saved, as a typed
`operatorQuote` naming the capture's digest and the request's, or where
this instance turns the rule off in its configuration (operator direction,
2026-11-07). Every role and worker carries the rule, and `npm run test:docs`
holds a branch to it against its merge base with `main`, so a record written
before keeps its bytes. Its verbatim screen compares each line the branch adds,
or joins by a deletion, to Markdown or to source under `scripts/` and
`packages/*/src/` with every
text capture under this checkout's ignored intake root, and a run of twelve
consecutive words both hold fails by file, line and the capture's digest,
never the words; a run the repository already held is its own text, and a
checkout with no capture prints `verbatim screen: no captures`. The screen
compares words, not addresses: a link target, a code span, a URL and a path
each count as one word that no capture holds, so a line that links a document
a capture also names is no finding, and in an instance a changed file whose
bytes equal the incoming kit manifest's entry is the kit's text and is not
screened
([decision](evidence/WO-276/decisions.md#wo-276-d019--the-verbatim-screen-compares-words-and-reads-the-base-tree-once-step-a14)).
The screen
reads every text file under the intake root as the operator's words, so that
root holds the operator's messages and nothing a session or a tool writes for
itself: a session's drafts and a tool's output go under the ignored
`docs/control/local/` lane or the session's scratch directory
([the pass that recorded it](planning/passes/whole-plan-and-codebase-review-2026-11-09.md)).
A record the
branch adds that attributes words to the operator without a capture
citation fails too, while one written before stays an advisory. An
`operatorQuote` the branch adds carries `captureSha256` and `requestedIn`
(the digest of the capture of the operator's request to save it), and the
screen admits that capture's words inside it. Electing
`features.verbatim-operator-words` turns the rule off: both checks then
advise instead of failing
([decision](evidence/WO-259/decisions.md#wo-259-d006)).

The same gate's `terms` task screens the lines a branch adds with the private
local-terms list, whose two classes §First steps describes. A refuse-mode match
fails by file, line and mode without printing the term. A context-mode match
fails nothing: the task prints it as a `CONTEXT` line naming the file and line,
the gate relays those lines when the task passes, and the stage at hand (the
executor before its handoff, the verifier, the final reviewer, a planning pass
before its publish) runs `node scripts/terms.mjs branch`, reads each listed
line beside the entry it matched, rewords a line that names the listed thing
and states how many it read. A reused row of the document gate prints no task
output, so a stage reads the lines from that command and not from a reused
row. The publish helpers screen a branch's committed change the same way
before their first push
([the screen](evidence/WO-259/decisions.md#wo-259-d009);
[the two classes and what a match joins across](evidence/WO-276/decisions.md#wo-276-d008--the-lists-two-classes-and-the-runs-a-match-joins-across-step-a1);
[where each screen lists a match](evidence/WO-276/decisions.md#wo-276-d010--where-each-screen-lists-a-context-mode-match-steps-a2-to-a4)).

Artifacts follow their declared contract and check, never the preceding
instance's shape. Writing guidance identifies the contract, meaning the document sections
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
