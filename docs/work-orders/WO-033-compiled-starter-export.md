# WO-033 — The starter is a compiled export: one configuration root, registered target repositories, a launchpad export that carries the saved build, and a lane-sync helper (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. It adds control-plane capability (a
configuration root, work orders against registered target repositories, a
launchpad export that carries a compiled harness bundle and a pinned runtime
build, and `worktree sync`) while keeping every existing reader's JSON
contract, the event schema, and the legacy log; no exported runtime package
capability changes. Assigned at activation under the standing opt-out
default (06-roadmap.md §Release boundary).
**Nomination provenance:** the 2026-09-06 planning pass, from the operator's
dispatch describing the enterprise workflow ("multiple workstreams for working
in different repos ... act as a launchpad and the user will not have to have
separate claude sessions in all of these repos"), rescoped the same day by
the phase-two redirect after the operator's correction that an export of the
process kit alone "ships no DotLn": a fork must receive an actor, meaning a
compiled build the fork's harness enforces, not scripts and prose. The
operator's chain is the design rule: progress in core makes the starter
better, which makes each fork and its targets better. Planner-synthesized
draft; the dispatch and the correction are preserved locally as
compaction-safety captures. Opaque identifier, not a priority. The
clean-room screen found no employer, credential, internal-service, or other
stop condition; the two repositories named are the operator's own public
repositories.
**Depends on:** WO-039 merged (the `harness-v1` target, the `harness`
command, and the Contributor build the export carries); WO-038 merged (the
license posture in package metadata and the export's default license
files); WO-030 merged (per-order segments and selection; satisfied at
`v0.7.0`); WO-018 merged (`scripts/lib/`; satisfied at `v0.4.1`); WO-026
merged (the generated index; satisfied at `v0.5.2`); WO-021 merged
(per-worktree Beacon caches; satisfied at `v0.8.0`).
**Recommended placement:** wave 2, lane A, beside WO-040, with which it shares
no primary write surface. This is the order the external-fork timeline
binds: WO-038, then WO-039 phase 1 and its self-host, then this order, is the
critical path; if capacity is short, run those three alone and let the rest
float. A recommendation, not a dependency token.

**Cites (read these sections):** 00-vision.md §Common substrate, local
doctrine (the same legos, not the same finished organization) and §The
one-paragraph story; 03-architecture.md §Platform and instance boundary (the
portability target; "the fork is of the starter, not of DotLn core"; the kit
is the shared mechanism, the fork is the doctrine), §Agent enablement skills
(bring your own agent; the preload compiled from the WorkOrder, role,
loadout, and authority envelope), and §Session lifecycle & resilience (the
operator worktree projection; the tool never rebases, force-deletes,
auto-merges, or discards); 12-workstream-application.md §One workstream
across repositories (each bounded order names its repository bases) and
§Arriving at the desk; 02-domain-model.md §Identity and composition
(AuthorityEnvelope; a registered repository's authority profile is one) and
§Feedback (the harness-lowering contract after WO-039);
07-execution-guide.md §Operator resume phrases (the machine contract that
must survive), §Workflow closeout and releases, and §Discipline (isolation;
no config mutation of safety boundaries; no new dependencies; recovery point
before destruction); `docs/PLAYBOOK.md` §The loop, per work order and
§Concurrency; 10-ir-compatibility.md §Separate version axes (the segment
layout is a storage axis; a configuration schema is another);
09-audit-resilience-privacy.md §Privacy and minimization (physical paths and
private values stay out of public artifacts); 01-principles.md Principles 5,
16 (workplace camouflage generalized), 17, and 18; ADR-0006 Decisions 1 and
7 and its 2026-09-06 amendments; `docs/LEGAL.md` (§Decision — 2026-09-06;
the distribution gate); `docs/planning/concurrent-work-orders-plan.md` (lane
rules; the rebase helper as an automation candidate; the trial's required
measurements); `scripts/lib/paths.mjs`, `scripts/lib/control-store.mjs`,
`scripts/lib/git.mjs`, `scripts/resume.mjs`, `scripts/worktree.mjs`,
`scripts/release.mjs`, `scripts/work-orders.mjs`, `scripts/harness.mjs`
(after WO-039), and their shell and Node suites.

**Objective:** Make the control plane runnable from a repository that is not
DotLn core, driving bounded work orders against registered target
repositories whose own trees receive only conventional branches and pull
requests; export a launchpad instance that carries the Contributor build as
an enforceable harness bundle plus the pinned runtime build the bundle needs,
so that a fork of the starter runs its sessions on a compiled actor from its
first commit and takes every later improvement in core as a re-export; and
give the paired-wave workflow the sync step it is missing.

**Observed gap (dated 2026-09-06, `main` at `v0.13.1`):**

- Every control-plane script resolves its document roots as string literals
  relative to the tool's own location: `"docs/control` 29 times,
  `"docs/work-orders` 18, `"docs/final-reviews` 13, `"docs/verifications` 6,
  `"docs/publication` 5, `"docs/evidence` 4, `"docs/releases` 3,
  `"docs/planning` 3 across `scripts/*.mjs` and `scripts/lib/*.mjs`. The
  plane can run only inside this repository's layout.
- `worktree start WO-NNN` creates `<main>-wo<NNN>` as a sibling worktree of
  the same repository; no work-order field names which repository an order
  changes, although product 12 requires it and the domain model's WorkOrder
  carries `repo` and `baseCommit`.
- `release close` and `worktree publish` assume this repository's README
  release block, `packages/*` component versions, corpus lanes, and
  publication checks. A launchpad coordinating other repositories has none of
  them.
- The operator's `DotLn-Enterprise-Starter` and `DotLn-Angular` repositories
  are empty (public API, 2026-09-06). Nothing produces a starter, and the
  first draft of this order would have produced one with no actor in it:
  scripts, templates, and prose, which is the predecessor's shape with better
  hygiene.
- After a sibling merges, the remaining lane's base update is a manual
  stash, fast-forward, apply, regenerate, and retest sequence described only
  in prose. Every order after WO-030 ran serially, so no paired wave has been
  measured; this horizon schedules several.
- The control plane is not self-contained: `scripts/resume.mjs` and
  `scripts/lib/beacons.mjs` import the seven build-free `.mjs` leaves under
  `packages/skeleton/src/` from source, while `scripts/lib/beacon-observe.mjs`
  imports the same library from `dist/`. An exported launchpad without the
  skeleton package could not emit control Beacons. Eleven scripts also derive
  the repository root from `import.meta.url` in four different ways.
- The root `npm test` chain rebuilds `packages/*/dist` at step 15, after
  `scripts/test-worktree.sh` (step 9) has already exercised `release.mjs`,
  which loads `packages/skeleton/dist/src/cli.js`; that suite runs against
  whatever stale build exists. A build-first ordering is the bounded
  boy-scout item nominated for this order below.
- The operator stated during the planning pass that the starter is intended
  for several external organizations to fork as the base of their own
  workflows; the operator's fork is the first test and the first external
  organization is expected within about a week. Every fork must be able to
  take later kit updates without those updates touching the fork's own
  orders, control segments, evidence, or its instance-owned build overlay.

**Design (scope discipline):**

- **Phase 1 — configuration root (pure refactor).** Add
  `scripts/lib/config.mjs` with `loadConfig(root)` and a documented
  `dotln.config.json` schema, version 1: `roots` (control, orders, work
  orders, verifications, final reviews, evidence, releases, planning,
  publication, intake, workstreams, refutations), `repositories` (an `id` →
  declared base branch, worktree parent, camouflage deny list, authority
  profile, repository class; `self` is implicit), `build` (the launchpad's
  saved build: loadout id, profile id, the instance overlay's path), and
  `release` surface toggles (README block, component versions, corpus and
  publication checks). Absence of the file means today's DotLn defaults,
  byte for byte. Every root is resolved through the config; the literal
  `docs/...` roots and the eleven ad hoc root derivations disappear from
  every other script. The launchpad root is found by walking up from the
  working directory to a directory containing `dotln.config.json` or,
  failing that, the Git top level; `DOTLN_LAUNCHPAD` overrides it for
  sessions that run inside a target worktree.
- **Beacon portability.** The control plane's Beacon emission must not
  depend on the skeleton package. Either the seven build-free `.mjs` leaves
  move to a build-free module the control plane owns and the skeleton imports
  by name, or a `packages/beacons` workspace with no build step serves both;
  the executor chooses and records the reason. One module identity results:
  no file is imported both from source and from `dist/`. The kernel,
  compiler, reactor, and codebook semantics are unchanged and every existing
  Beacon fixture passes byte for byte.
- **Phase 2 — target repositories are builds, not just paths.** A work order
  may declare `**Repository:** <id> @ <base>` in its leading metadata; absent
  means `self`. A registered repository carries an **authority profile**,
  which is an `AuthorityEnvelope` in the configuration (allowed and denied
  effect patterns for orders against it: worktree, edit, test, push the
  branch, open or update the pull request; never merge, deploy, or write to
  another repository); the order's compiled WorkOrder inherits it and the
  `worktree start` handoff echoes it as a receipt. The founding "never push
  or open a pull request" rule, overridden per repository by hand, becomes
  this per-repository declaration. A repository may name a **repository
  class** (for example an Angular UI class), which is a link group of
  supports and checks every member equips, and the launchpad keeps one
  **repository profile** document per registered repository (purpose and
  the standards to emulate, commands, local application startup, branch and
  pull-request policy, demonstrated architecture, and a pinned
  upstream-references list of `owner/repo@tag path#anchor` entries with one
  line each on why the section matters), authored by a read-only archaeology
  order for an established repository or by the establishing order for a
  greenfield one, and treated as repo-native authority (Principle 17). The
  profile is loaded on demand by the role skill for the active order, never
  at cold start. Policy layers launchpad → class → repository, which is the
  scope layering the founding notes asked for when rules on one repository
  failed to carry to the next. For a registered target, `worktree start`
  creates the worktree from that repository at the declared base under the
  configured parent, activates the order, **emits the harness bundle for the
  launchpad build plus the repository's class and profile into the
  worktree's ignored local harness configuration** through WO-039's
  `harness emit` (the target repository never sees a DotLn file in a commit;
  the bundle lives under the worktree's local exclude and leaves with the
  worktree), and prints the same handoff. The activation event records the
  repository id and base commit; no physical path enters a control event,
  the projection, or the index. A local ignored registry under the control
  local directory maps worktree paths to the launchpad and order so `resume`
  commands run from the target worktree select the order by branch as today.
  Verification, final-review, PR body, and release-note artifacts are written
  in the launchpad under the order, never in the target tree. `worktree
  publish` pushes the target branch and opens the pull request on the target
  repository through the existing GitHub helpers, and a camouflage lint
  refuses a title or body containing a term from the repository's deny
  list. The deny list has two parts: the launchpad's own vocabulary, which
  is committed in the configuration because it is public, and the
  instance's local-terms list, which lives only in ignored local state and
  is read through WO-039's local-terms check, so that the terms
  `CLAUDE.md` says must not re-enter are refused without ever being
  committed or hashed into any file; an absent local list makes the lint
  report `unavailable` on that part rather than pass. The lint fixture
  uses a synthetic term. `release close` for a target order performs the guarded finish and
  containment proof, records an honest no-release disposition, and never
  touches the target's tags; a per-repository release policy is out of scope.
- **Phase 3 — launchpad export carries the build.** `npm run launchpad --
  export <dir>` materializes a launchpad instance into an empty directory:
  the control-plane scripts and their suites as a pinned copy; a
  `package.json` with the same script names and the exactly pinned dev
  dependencies; **the Contributor build's compiled harness bundle** for the
  launchpad profile (settings permissions and hooks, role skills, and the
  marked instruction block) so a session opened in the fork is governed by
  the same mechanisms core's sessions are; **a pinned runtime build under
  `kit/runtime/`**, the unminified compiled output of `@dotln/compiler` and
  the skeleton modules the hooks and the `harness` command import, byte-
  identical to core's build at the named commit and manifest-listed, with no
  npm publication; `harness check` wired into the export's `npm test`; a
  `dotln.config.example.json` (the instance's real `dotln.config.json` is
  instance-owned and never overwritten); the document roots with their
  README conventions; a minimal operating contract (`CLAUDE.md` with
  `AGENTS.md` symlinked) whose marked block is generated and whose
  hand-written floor carries only the clean-room and secret rules and the
  resume phrases; a repository-profile template and a workstream template
  with their required sections, loaded on demand by the role skill; the
  executor half of the execution guide and the operator playbook; a
  sanitized harness-security template; a client-facing README (register
  repositories, run the loop, take upstream updates, re-emit the build); the
  implementation-overlay template from `docs/publication/` as the instance's
  product-doc seed with an upstream pointer list to core's blueprint at the
  pinned commit rather than a copy of it; a pre-drafted first work order in
  WO-001's shape extended with WO-039's harness smoke, the registration of
  the fork's own local-terms list in its ignored local state before any
  prose is committed, and the ledger's preserved constrained-environment
  audit questions (gateway and provider behavior, metering differences
  between foreground and delegated execution, interruption recovery,
  managed settings precedence), so the fork observes
  its own host, harness, and gateway before it trusts its build; a
  `.gitignore` for intake, Beacons, and runtime stores; the license files;
  and an `UPSTREAM.md` plus `KIT-MANIFEST.json` naming the DotLn commit, tag,
  and per-file hashes of every kit file. Effort attestation refuses a harness
  version that bounded discovery has not recorded, so a fresh fork's orders
  declare `any` until its own discovery record exists, and the client README
  says so. The export never includes intake, `.claude/settings.local.json`,
  Beacons, runtime stores, source of the runtime packages, or evidence of
  this repository's orders.
- **Kit, instance, and the instance's build overlay are separate sets of
  files.** The manifest lists kit files only: scripts, suites, `package.json`,
  the operating contract's marked block and floor, the guide and playbook
  copies, templates, README, the harness bundle, the runtime build, the
  license files. Instance files are never in the manifest: `dotln.config.json`,
  everything under the control, work-order, evidence, verification,
  final-review, workstream, and refutation roots, the instance's product
  overlay, and the **instance build overlay** (`build/overlay.json`: the
  fork's registered repositories, classes, extra units, and envelope
  narrowings, which `harness emit` composes over the kit's Contributor build
  to produce the fork's own `.claude/`). The Contributor build is starter
  content, not kit law: the overlay may replace the identity, unequip any
  unit, narrow or widen the envelope within the fork's own harness posture,
  or declare `build: none`, in which case `harness emit` produces only the
  fork's hand-written floor and `harness check` verifies that; the client
  README says so in its first section, per the vision's rule that the
  platform supplies the compiler and mechanism contracts without
  prescribing the loadout. `launchpad export --update <dir>`
  refreshes an existing export: it requires a prior manifest, replaces a kit
  file only when its current bytes still match the prior manifest's hash,
  lists and refuses to overwrite a kit file the instance modified locally,
  adds new kit files, removes kit files the new manifest dropped only when
  unmodified, never touches an instance file, rewrites `UPSTREAM.md` and the
  manifest to the new commit, and prints the re-emit instruction so the
  fork's `.claude/` is regenerated from the new kit plus its own overlay.
  When a kit change needs something from the instance (a new configuration
  field, a renamed root, a changed phrase, a new overlay key), the kit
  carries a dated instance-actions note and the update prints it; the
  command never applies an instance action itself. Updates flow core →
  starter by this command, run by the operator and landed in the starter as
  an ordinary reviewed change; they flow starter → forks by each fork's
  ordinary upstream merge, which touches only kit files because the manifest
  keeps them separate, followed by a re-emit reviewed in that fork. Nothing
  refreshes a fork automatically. This is the operator's chain made
  mechanical: a compiled unit added in core reaches every fork's sessions as
  a kit update plus a re-emit.
- **Sibling registry in core.** The operator treats the starter and the
  Angular consumer as first-class siblings of this repository, so core tracks
  them: `docs/siblings/README.md` holds one entry per sibling with its
  purpose, upstream relation (an export of core at a named commit, or a
  consumer of a named contract version), the kit manifest version and build
  hash it carries, the orders in core that advanced it, and its capability
  rows in the capability table. Every `launchpad export` and `--update`
  appends a receipt (destination sibling id, core commit, manifest hash,
  build hash, date) under `docs/evidence/siblings/`, so the starter's kit
  version is evidence, not memory. Forks of the starter are not tracked here
  unless a fork's experience changes core, the starter, or the Angular
  consumer, in which case the lesson enters as an ordinary ledger entry or
  work order.
- **License files at export.** The posture was decided on 2026-09-06
  (`docs/LEGAL.md` §Decision): the export copies core's `LICENSE`,
  `LICENSE-docs`, and `NOTICE` into the kit as manifest-listed kit files by
  default, so every starter and fork states its terms, and the runtime build
  travels under the same Apache-2.0 terms with the NOTICE. `--license none`
  remains only as an explicit opt-out that writes the no-rights-granted
  notice as `LICENSE-PENDING.md`. The command never invents license text;
  WO-038 owns the package metadata and the publication guard.
  **WO-038 retarget reconciliation (2026-09-06):** the redirected draft
  already states the decided default, so it is retained rather than replaced
  by the earlier explicit-license proposal. `LICENSE`, `LICENSE-docs`, and
  `NOTICE` must each be listed and hashed in `KIT-MANIFEST.json` on the
  default path; only an explicit `--license none` selects the no-rights
  notice. WO-038's [receipt](../evidence/WO-038/README.md) records the checked
  core license surfaces that this exporter must carry. This note changes no
  license choice and implements no export command in WO-038.
- **Phase 4 — lane sync.** `npm run worktree -- sync WO-NNN`, run inside the
  order's worktree after a sibling has merged: mint a recovery checkpoint ref
  for the order without appending a lifecycle event; `git stash push
  --include-untracked -m 'WO-NNN sync <recordedAt>'`; fetch and fast-forward
  the branch to `origin/main` when it has no commits, or merge `origin/main`
  into it without rewriting when it has reviewed commits; `git stash apply`
  (never `pop`, never `drop`); report every conflicting path classified as
  generated projection (regenerated automatically: `current.md`, the index,
  the publication locks, the generated harness configuration) or authored
  (left for an explicit resolution); invoke `release prepare` for a colliding
  unpublished target and report which acceptance claims need new evidence.
  Under the operator's 2026-09-07 correction, no sibling phase is a prerequisite
  and integration-only changes do not append a repair event or invalidate a
  verification report. The integrating actor records current checks and carries
  forward unchanged claims; a behavior-changing resolution or an actual defect
  needs bounded repair and independent evidence. It refuses outside a matching
  `wo-NNN` worktree, when the requested upstream cannot be resolved, and when
  ignored intake is present without a named backup. The operator voluntarily
  serializes final review through release close; this helper installs no gate.
- **Bounded boy-scout item (nominated 2026-09-06, authorized here):**
  reorder the root `npm test` chain so the forced package build precedes the
  first suite that loads built output (`scripts/test-worktree.sh` through
  `release.mjs`), and assert in that suite that the loaded skeleton build is
  fresh. Unambiguous, low risk, covered by this order's `npm test`; report it
  in the result. The fuller runner is WO-036, not this item.
- **Declined alternatives, recorded:** exporting the process kit without a
  build (the first draft; a fork would run on prose); publishing `@dotln/*`
  packages for the starter to consume (a separate publication decision; the
  pinned runtime build is reviewable compiled output under the decided
  license, not a registry dependency); a Git subtree or submodule of DotLn
  core inside the starter (couples the launchpad to core's history and
  layout); committing DotLn control or harness files into target
  repositories (violates camouflage and repo-native authority; the worktree-
  local bundle is ignored and leaves with the worktree); a rebase that
  rewrites reviewed commits (the tool never rebases).

**Deliverables:** `scripts/lib/config.mjs` and the schema documentation; the
`Repository:` field parser and target-worktree lifecycle with the
worktree-local harness emit; the camouflage lint; `scripts/launchpad.mjs`
export and update with the harness bundle, runtime build, and overlay
composition; `worktree sync`; fixtures and tests in the resume, checkpoint,
worktree, release, harness, and work-order suites plus a real-Git
launchpad-and-target fixture; the write-backs below.

**Acceptance criteria (all required)**

1. With no `dotln.config.json`, every existing suite passes unchanged, and
   `status --json`, `current.md`, the generated index, `times`, `usage`, and
   a release manifest derived over the real log are byte-identical to the
   activation base (`cmp` transcripts). A test refuses any remaining literal
   `docs/` root outside `scripts/lib/config.mjs`.
2. A fixture launchpad in a temporary directory with non-default roots drives
   `activate`, `implementation-ready`, `verify`, `verification-result`,
   `final-review`, `final-review-result`, and `worktree finish` through the
   unchanged commands, writing only under its configured roots.
3. A fixture work order declaring a registered target repository activates;
   `worktree start` creates the target worktree from the declared base,
   echoes the repository's authority profile as a receipt, and emits the
   harness bundle for the launchpad build plus the repository's class and
   profile into the worktree's ignored local configuration; the compiled
   WorkOrder's allowed and prohibited operations equal that profile; a
   repository class's declared checks appear in every member order's required
   checks; the activation event and every projection show the repository id
   and base commit and no physical path; `status`, `next`, `verify`, and
   `final-review` work from the target worktree through `DOTLN_LAUNCHPAD` and
   through the local registry; every report lands in the launchpad; the
   target worktree's branch and every commit it can produce contain no DotLn
   control, work-order, evidence, or harness file.
4. `worktree publish` for a target order opens the pull request against the
   target repository through the `gh` stub with the reviewed body, and the
   camouflage lint refuses a title or body containing a deny-listed term;
   `release close` for a target order records the no-release disposition,
   removes only the target worktree and merged branch after containment, and
   creates no tag in either repository.
5. `launchpad export <dir>` refuses a non-empty destination; the exported
   scripts and runtime build are byte-identical to the source commit named
   in `UPSTREAM.md` and the manifest hashes verify; the exported suites,
   including `harness check`, pass in place with an offline `npm ci` against
   the exported lockfile; a lifecycle transition inside the export emits a
   control Beacon without any `packages/skeleton` source present; a session
   opened in the export under the emitted bundle is refused a denied effect
   by a generated hook and resolves a role skill by resume phrase (recorded
   smoke); a negative fixture proves the export contains no intake, local
   settings, Beacon output, runtime store, package source, evidence from
   this repository's orders, or any term list, hashed or plain; the
   local-terms check runs over every exported kit text with the operator's
   list present and reports it; and the reviewer reads the exported kit
   text, including the pre-drafted first order's audit questions, for any
   description of a specific managed host, gateway, or policy (generic
   questions are permitted, descriptions are not). A grep test proves no
   `scripts/` file imports
   the same module from both source and `dist/`. The export carries
   `LICENSE`, `LICENSE-docs`, and `NOTICE` byte-identical to core's as kit
   files, writes `LICENSE-PENDING.md` only under `--license none`, and never
   fabricates license text. `--update` over a fixture export with one
   locally modified kit file, one instance file, one overlay file, one
   dropped kit file, and one new kit file replaces only the unmodified kit
   files, lists the modified one as refused, leaves every instance and
   overlay file byte-identical, rewrites the manifest and `UPSTREAM.md`, and
   prints the re-emit instruction; a re-emit over the fixture overlay
   produces a `.claude/` that differs from the kit's only where the overlay
   says; a second fixture overlay that replaces the identity and unequips
   two units re-emits to a bundle that carries neither, and a third that
   declares `build: none` re-emits to the floor alone with `harness check`
   passing on it; the camouflage lint refuses a fixture body containing a
   synthetic local term and a fixture body containing a launchpad
   vocabulary term, and reports `unavailable` for the local part when no
   list is present; without a prior manifest it refuses. Inside the export,
   the directed-load total per role is measured by WO-039's criterion 6
   method over the export's own instruction file and skills, reported in
   the receipt, and is not larger than core's for the same role at the
   export's commit, so the fork's biography is measured beside its build
   rather than assumed.
6. `worktree sync` over a real-Git fixture with two orders, a merged sibling,
   a conflicting generated projection, a conflicting authored file, and a
   colliding release target: mints the checkpoint, keeps the named stash,
   updates the base without rewriting commits, regenerates the projections,
   reports the authored conflict, applies collision retiming, and refuses
   its three refusal cases without changing the tree. Vary a third order's
   lifecycle phase and prove it never gates the sync or appends control events;
   distinguish an integration-only case from a behavioral conflict requiring
   affected-claim evidence.
7. Write-backs land: `docs/siblings/README.md` created with the starter's
   entry and the export receipt convention, plus a dated capability-table row
   for `launchpad.starter` at its evidenced level; 03 §Platform and instance
   boundary (the physical split's first slice carries the build; what stays
   in core); 07 §Operator resume phrases (config discovery, `Repository:`,
   `DOTLN_LAUNCHPAD`, `sync`) and §Workflow closeout (target orders);
   `docs/PLAYBOOK.md` §The loop and §Concurrency (the target loop and the
   sync step replacing the prose procedure); 12 §One workstream across
   repositories (the route taken); 10 §Separate version axes (the
   configuration schema axis and the overlay); `docs/README.md`; ADR-0006
   Amendments (a dated note naming this order as the first physical-split
   slice under Decision 7, with the build in the kit); `docs/LEGAL.md` (a
   dated observation that the runtime build travels under the decided
   terms); the root release block; the publication index rows and both
   edition locks; ledger entry.
8. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts for criteria 1 through 6; `npm test`; the
wave receipt below.

**Write-back duty:** as listed in criterion 7. In addition, the order that
merges second in its wave records the paired-wave receipt in
`docs/planning/phase-two-plan-2026-09-06.md`: elapsed per phase from
`status`, operator interventions, integration repair, and time away, per the
concurrent plan's trial section. If this order merges second, it performs its
own sync with the helper it ships and discloses that self-referential
instrument in its result.

**Non-goals:** publishing packages, binaries, or package source into the
starter; changing the license posture (decided; the export carries the
files); automatic refresh or re-emit of any fork; multi-repository
workstreams and their projections (WO-034); DotLn runtime transports
executing target work; automatic worker launch; changing lifecycle legality,
the event schema, or the legacy log; a lane generator, admission policy, or
scheduler; per-repository release ladders; rewriting reviewed history;
Angular, Nx, or any target-repository content; any external organization's
material; the harness target itself (WO-039).

**Operator-review assumptions**

1. The license posture is decided (`docs/LEGAL.md` §Decision — 2026-09-06)
   and its files land before this order; WO-038 lands the metadata and
   guard. The export carries those files by default so every fork states its
   terms.
2. Target repositories receive only conventional branches and pull requests;
   their DotLn state, including the worktree-local harness bundle, lives in
   the launchpad and in ignored worktree state.
3. Physical worktree paths stay in ignored local state and never enter
   committed control events.
4. The starter carries the Contributor build and a pinned runtime build;
   package source and publication wait for a publication decision.
5. The four phases are independently verifiable; if the operator prefers a
   split, phases 3 and 4 form the natural second order, and the split is
   recorded in the map before activation.
