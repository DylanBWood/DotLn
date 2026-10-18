# WO-221 — A registered target order runs under each host's default restrictive mode and closes without an operator step: trust admitted from the registration alone, an opt-in draft form of the target publish that the final publish reuses, declared regenerable output deleted at close, a declared target release, and release tags on the starter (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. A second hook admission class, a
per-order literal-rule fallback, generated Codex prefix rules and printed
Copilot lines; the `--draft` form of `worktree publish --target-worktree`
and its reuse at the closed-phase publish; the `disposable` and `release`
registration keys; a target gate advisory; the starter refresh's tag and
Release; kit README and product 07 text. No existing refusal weakens.
Assigned at activation under the standing opt-out default.
**Cost:** adds the admission class and its fixture cases in
`packages/skeleton/src/harness-host.ts` and the suite that declares it;
the literal-rule writer and remover in `scripts/worktree.mjs` and
`scripts/release.mjs` with a `harness check` row in
`scripts/lib/harness.mjs`; the Codex rule generator in the `.codex`
emit path of `scripts/lib/harness.mjs`; the `--draft` branch of
`publishTargetWorktree` and the reuse branch of `publishBoundTargetCommit`
in `scripts/lib/target-publish.mjs`; the `disposable` and `release`
validators in `scripts/lib/config.mjs`; the disposable deletion, the
fetched-tree ignore judgment and the new refusal text in
`scripts/lib/target-worktree-close.mjs`; the `baseCheckoutWrites` advisory
in `scripts/lib/target-gate.mjs`; the target release and the sibling tag
in `scripts/release.mjs` and `scripts/lib/starter-refresh.mjs`; the
release-close profile sentence in
`packages/skeleton/src/loadouts/contributor.ts`; cases in the fixtures of
the Preflight suites; the kit README and product 07 sections the
write-backs step names; one operator-launched qualification record.
Removes the states the gap records: the hand-edited user setting a
consumer needs before its first target push; the second pull request and
its hand close; the WIP commit on `wo-NNN` and its undo at final review;
the close refused on build output and the session moving it to scratch;
the base checkout refused on a cache the merged tree ignores; the
no-release-ever for a target; the starter without a tag a fork can name.
Re-mints: `packages/skeleton/src/harness-host.ts` and
`packages/skeleton/src/loadouts/contributor.ts` are registered sources of
the authority and harness editions (`scripts/lib/evidence-sources.mjs`
lines 162, 166, 260, 264, 331 and 335), re-minted deterministically; no
`FEEDBACK_SOURCE_PATHS` file changes (`packages/skeleton/src/feedback-audit.ts`
lines 25 to 60 list none of this order's surfaces), so no live feedback
episode is owed. `scripts/release.mjs`, `scripts/target-gate.mjs`,
`scripts/lib/target-gate.mjs` and `harness-host.ts` are declared machinery
sources (`scripts/test-runner.mjs` lines 139, 159, 217, 253, 270, 323,
324, 347, 421 and 459), so `npm test -- --review` runs before handoff.
Live episodes: three bounded host qualifications (Claude Code auto mode,
Codex Auto, Copilot default) against a scratch GitHub repository under
the operator's account, launched by the operator as WO-146's were and
recorded as evidence; they spend the operator's credits once each.
Wall-clock: a target close gains one `ls-files --others` pass per
disposable root and one `check-ignore` pass over the base's untracked
files; a gate command gains two `ls-files --others` passes in the base
checkout; a draft publish costs one push and one pull-request creation
that the final publish no longer pays as a second pull request; the
starter refresh gains one tag push and one Release creation. Commands:
adds `--draft`, the `disposable` and `release` keys, the `Target release
classification` header, the printed `--add-dir` and `--allow-tool` lines
at `worktree start`. Context bytes: this file, about 34,000. Tokens:
unknown until run. Steps: 20.
**Nomination provenance:** the fork's verifier report and its release-close
report of 2026-10-18, carried by the operator into the
`planning: quick planning pass with some observations from running in the
fork` dispatch (ignored capture, SHA-256
`f6fdbcbb18b5fcce47a18b16d13a6b441e0fab301f24a08861909dda23b68662`); the
operator's four mid-turn directions in the same capture: the draft at
verified is the fork's route, not the platform's; the platform must be
extensible for it; the fork's planning pass gets a prompt; the starter has
no releases to fork from. FUP-dbced48c3d572461 (the 2026-09-30 second
pass recorded an auto-mode trust entry as the operator's action outside
the repository; its spirit reopened on 2026-10-18 when the first target
push under auto mode was denied). FUP-81c8f4915c7790d3 (the draft at
verified; this order takes its platform share only). The fork's own
D8 in its 2026-10-18 planning document (reopen when the kit lands the
draft route). Planner-synthesized by the
[2026-10-18 pass](../planning/fork-observations-2026-10-18.md). Opaque
identifier, not a priority. Clean-room screen: the fork is named as the
operator's instance and its target as the public repository it is; no
target code, no employer material; the fixture target is a scratch
repository.
**Depends on:** WO-210 (closed, v0.82.0: a target order reaches release
close); WO-215 (closed, v0.81.0: the starter refresh); WO-178 (closed,
v0.61.2: the first admission this order's second class sits beside);
WO-216 (closed, v0.84.0: the structural phase and the Preflight rule the
handoffs use); WO-073 and WO-111 (closed: registration, classes and the
target gate). WO-219 edits `packages/skeleton/src/harness-host.ts` for its
rows with no typed edge; whichever runs second rebases on the first.
**Recommended placement:** position 1 of the serial queue, before
WO-217: the operator's instance runs its next target order (its WO-005)
into every gap this order closes, and the operator's 2026-10-18 dispatch
is the direction. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-210",
    "relation": "satisfied-by-close",
    "reason": "a target order reaches release close; this order's close changes sit on its target close path"
  },
  {
    "workOrderId": "WO-215",
    "relation": "satisfied-by-close",
    "reason": "the starter refresh this order extends with a tag and a Release"
  },
  {
    "workOrderId": "WO-178",
    "relation": "satisfied-by-close",
    "reason": "the first hook admission (the exact release-close helper) that the second admission class follows"
  },
  {
    "workOrderId": "WO-216",
    "relation": "satisfied-by-close",
    "reason": "the structural phase and the Preflight handoff rule this order's handoffs use"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Workflow closeout
and releases (the target close, the starter refresh, "no pushes to any
other branch"), §Operator resume phrases (the `worktree publish` row),
§Independent workflows and integration, §Preflight before the full gate;
03-architecture.md §Platform and instance boundary ("the core does not
silently ship the author's preferred organization as universal defaults");
`docs/work-orders/WO-178-the-record-holds-what-the-operator-sees.md` (the
admitted publish command and its declined alternatives);
`docs/work-orders/WO-195-roles-finish-what-was-dispatched.md` (the
declined project allow rule); `docs/work-orders/WO-146-*.md` and
`docs/evidence/WO-146/operator-qualification.md` (the operator-launched
qualification pattern); `packages/skeleton/src/harness-host.ts`
(`releaseCloseAdmission`, line 1227, and the hook response at lines 1296
to 1300); `.claude/hooks/permissions.mjs` (the emitted hook);
`scripts/lib/target-publish.mjs` (`publishTargetWorktree`, line 776;
`publishBoundTargetCommit`, line 913; `pushObservedCommit`);
`scripts/lib/target-worktree-close.mjs` (`closeClean`, lines 65 to 86;
the ignored-material refusal, line 424; `closeTargetWorktree`);
`scripts/lib/target-gate.mjs`; `scripts/release.mjs` (the target branch,
lines 2455 to 2470; `no-release`, line 2461); `scripts/lib/starter-refresh.mjs`
(`--no-tags`, line 120); `scripts/lib/siblings.mjs`; `scripts/lib/config.mjs`
(`validateClasses`, line 385; `validateRepositories`, line 452;
`SECTION_KEYS`); `scripts/lib/target-worktrees.mjs`
(`targetWorktreeForOrder`, `recordRepositoryClone`); `scripts/worktree.mjs`
(`start`, `publish`, `finish`); `scripts/lib/harness.mjs` (the
`.claude/settings.json` and `.codex` emit paths, `checkHarness`);
`scripts/kit/README.client.md` §First steps, §Kit files and instance
files, §Taking upstream updates; `docs/repositories/README.md`; the
[2026-10-18 planning document](../planning/fork-observations-2026-10-18.md)
§3 (the host documentation read for this design) and §4 (the routing).

**Objective:** An exported instance with a registered target repository
runs a target order from `worktree start` through its own draft route,
the final publish and `release close` under each host's default
restrictive mode, and the operator types phrases and merges one pull
request:

- **Trust comes from the registration and nowhere else.** The kit's
  hook admits the registered repository's publication commands for the
  dispatched order's recorded target worktree, its registered remote and
  its order branch, at the phases where the lifecycle makes them legal,
  under the committed grant. Where the live qualification shows a host's
  classifier still runs, `worktree start` writes that order's literal
  rules into the main checkout's untracked local settings and the close
  removes them. Codex takes generated prefix rules in the emitted project
  configuration and a printed `--add-dir`; Copilot takes the shared hook
  and printed `--allow-tool` lines. Nothing names a repository that is not
  registered; nothing touches user settings; nothing outlives the order.
- **The draft is the instance's route; the kit only makes it possible.**
  `worktree publish WO-NNN --target-worktree --draft` is legal at
  `verified` for a target order: a commit object from the worktree's tree
  with HEAD and index untouched, pushed to the declared branch, a draft
  pull request, a record. The closed-phase publish of the same order
  reuses that branch and pull request: force-with-lease against the
  recorded draft head, title and body updated, marked ready. One pull
  request per order. Core's lifecycle never requires the draft; the
  instance's order names the actor and the phrase.
- **Close deletes declared regenerable output and judges the base by the
  fetched tree.** A class or registration declares `disposable` paths;
  the close deletes them from the target worktree and from the base
  checkout, judges the base's untracked files by the fetched base's
  ignore rules, still refuses undeclared ignored material naming each
  path once, and says in its refusal and its role text that build output
  is deleted, never moved to scratch or offered back. The target gate
  records writes into the clone's base checkout as an advisory.
- **A release where the registration asks for one, and a starter a fork
  can name.** `release.policy: declared` plus an order's `Target release
  classification` makes `release close --publish` tag the merged base and
  create the target's GitHub Release; the default stays `no-release`. The
  starter refresh pushes core's release tag onto the refresh commit and
  creates the sibling's Release, so a fork previews `--from vX.Y.Z`.
- **Ships with the next kit update.** Every mechanism is a kit file or a
  registration key; a consumer takes it through its upgrade order and
  re-emit, and its first target order after that needs no settings step.

**Observed gap (dated 2026-10-18 at `main` `32f9653f`):**

*Trust:*

- `harness emit` writes `.claude/settings.json` with four `permissions.deny`
  entries and the hook registrations and nothing else (the v0.84.0 starter
  checkout, read 2026-10-18). `releaseCloseAdmission`
  (`packages/skeleton/src/harness-host.ts` line 1227) is the only
  admission: the byte-exact release-close helper from the main checkout
  with a recorded release-close dispatch and a legal canonical action,
  returning `permissionDecision: allow` with the reason "Host deny and ask
  rules still apply" (lines 1296 to 1300). No admission names a registered
  repository's worktree, remote or branch.
- The record left host trust to the operator three times: the 2026-09-30
  second pass recorded an auto-mode environment entry as "the operator's
  action outside the repository" (FUP-dbced48c3d572461); WO-178 declined
  `autoMode.allow` prose in user settings and a project rule for a
  wildcarded interpreter; WO-195 declined a project `permissions.allow`
  rule because it would admit any order's publish without the recorded
  dispatch. Each decision was taken before a registered target repository
  had been published from under a host classifier.
- On 2026-10-18 the operator's instance ran its first target order under
  Claude Code 2.1.302 auto mode: `git -C <home>/Projects/DotLn-Angular-wo004
  push -u origin wo-004` was refused three times as "Out-of-Place
  Publication", the update-config skill twice as "Self-Modification", and
  the operator hand-edited `~/.claude/settings.json` (its
  `autoMode.environment` now lists the target repository, the launchpad and
  their `-wo*` worktrees; read in this pass with the operator's words left
  out). The fork's Codex sessions pass only because that operator runs
  `approval_policy = "never"` with `sandbox_mode = "danger-full-access"`.
- The host documentation read for this design (the planning document §3,
  with quotes and URLs): narrow literal `permissions.allow` rules resolve
  before the classifier and `permissions.deny` before it; `autoMode` is
  read from user or managed settings only, and project and local files
  are ignored on purpose; a Bash rule matches literal text, cannot be
  scoped by path, and must spell `git -C <absolute path> push …`; a `*`
  before the subcommand warns at startup; project `.claude/settings.json`
  allow rules apply only after the workspace trust dialog, while the
  untracked `.claude/settings.local.json` at the main checkout needs no
  trust and is where the host itself saves "don't ask again" rules,
  resolved through worktrees. Codex: version-controlled folders run Auto
  (workspace-write, on-request approvals, network off), a network command
  asks, project `.codex/` layers load only when the project is trusted, a
  `prefix_rule` with `allow` runs a command outside the sandbox without a
  prompt, and a worktree outside the workspace needs `--add-dir` or
  `writable_roots`. Copilot: reads `.claude/settings.json` hooks and not
  Claude permission rules; saved approvals live in the user-level
  `~/.copilot/permissions-config.json`; repository settings cannot
  pre-approve tools. Whether a hook's `allow` pre-empts the classifier is
  not stated in the pages read; WO-178's admission is the kit's standing
  claim and this order's qualification is its test.

*The draft:*

- `publishTargetWorktree` (`scripts/lib/target-publish.mjs` line 776)
  refuses unless the order is `closed` with a passing final review, binds
  `records.commit` to the reviewed subject and the passing review gate,
  and pushes it to `--branch <type>/<slug>` through
  `publishBoundTargetCommit` (line 913), which opens one pull request and
  records it. No form of the command is legal earlier, and none reuses an
  existing pull request.
- The fork's planning decision D8 opened a second pull request by hand:
  after `verification-result pass` the session pushed `wo-004` and opened
  a draft (DotLn-Angular #1, draft, closed by the operator) and the
  final review's publish opened #2 on `feat/scaffold-workspace` (merged).
  The fork's WO-004 step 13 committed on `wo-004` for the draft, against
  the executor rule "No branch commits before final review"
  (`.claude/skills/dotln-executor/SKILL.md` line 57). D8's reopen
  condition is the kit landing the draft route.
- Criterion 6 of the fork's order read the draft's workflow runs, which
  exist only after verification, so `verification-result pass` refused
  an unmet criterion and the operator waived it.

*The close:*

- `closeClean` (`scripts/lib/target-worktree-close.mjs` lines 65 to 86)
  lists the base checkout's untracked files with `ls-files --others
  --exclude-standard` under the pre-fast-forward working copy's ignore
  rules and refuses on the first. The fork's base checkout held
  `.angular/cache/22.2.3/dotln/.tsbuildinfo` and three siblings written by
  `@angular/build`, which resolves a worktree's cache to the main checkout
  through `commondir`; the pre-merge base had no `.gitignore`, the merged
  one ignores `.angular`.
- The ignored-material refusal (line 424) lists `.angular/`, `.nx/`,
  `dist/` and `node_modules/` (about 475 MB in the fork's worktree) and
  says "Move or remove the listed paths"; the close removes only
  bundle-owned files and Finder metadata. The fork's session moved the
  output to scratch and offered to restore it; the operator said three
  times that build output is deleted.
- `scripts/lib/target-gate.mjs` binds the target worktree's non-ignored
  bytes and HEAD before and after each command (line 89 onward) and reads
  nothing in the clone's other checkouts.

*Releases:*

- `scripts/release.mjs` sets `no-release` for every order with a
  `repositoryId` (line 2461) before `closeTargetWorktree`; the fork's
  registration denies `release.close` for the target; no key or header
  asks for a target release.
- `scripts/lib/starter-refresh.mjs` fetches with `--no-tags` (line 120)
  and pushes one fast-forward commit; `git ls-remote --tags` on
  `DylanBWood/DotLn-Enterprise-Starter` lists nothing and `gh release
  list` is empty (2026-10-18), while core's latest Release is v0.84.0. The
  fork took v0.83.0 by merging the refresh commit found by its message
  (`Merge starter v0.83.0`, `Take starter v0.83.0 #3`).

*Remote branches:* the close deletes the local `wo-NNN` and, by the
release-close role text, pushes to no other branch; the draft's remote
branch outlived the close until the operator deleted it. DotLn-Angular's
remote holds `main` only on 2026-10-18, so the forge's delete-on-merge
setting is in force there.

**Design (scope discipline):**

*A. Trust admitted from the registration.*

- A second admission class in `harness-host.ts` beside the first
  (`registeredTargetAdmission`): the command is a `git -C <path>` or
  cwd-bound `git push`, `gh pr create`, `gh pr ready`, `gh pr edit`,
  `gh pr view`, or the `worktree publish --target-worktree` helper
  spelled by the lifecycle; the path is the recorded target worktree of
  the dispatched order (`targetWorktreeForOrder`); the worktree's push URL
  parses to the registered repository; the branch is `wo-NNN` or the
  branch the order's draft record or `--branch` names; a force is only
  `--force-with-lease=<branch>:<recorded draft head>`; the committed grant
  admits `repo.push` and `pr.open` for that repository; and the order's
  phase makes the command legal (`verified` for the draft form, `closed`
  with a passing final review for the publish). The response is `allow`
  with a reason naming the registration, and "Host deny and ask rules
  still apply". A command outside every clause gets no admission.
- The fallback, decided by the qualification (criterion 4): when a host's
  classifier still runs after the hook's `allow`, `worktree start` of a
  target order appends the exact literal rules for that order (its
  worktree path, registered remote, `wo-NNN` and the declared branch) to
  the main checkout's untracked `.claude/settings.local.json` between
  DotLn-owned markers, and `release close` removes them; `harness check`
  names a stale rule. Off by default until the qualification turns it on
  in the registration (`hostRules: "literal"`); the rules never name
  another repository, never enter user settings and never outlive the
  order.
- Codex: the `.codex/config.toml` emit carries one `prefix_rule` allow
  per registered repository for the same commands, generated from the
  registration; `worktree start` prints `--add-dir <target worktree>` for
  a workspace-write session; `harness check` reports the generated rows.
- Copilot: the hook admission through the shared registration;
  `worktree start` prints `--allow-tool 'shell(git -C <target worktree>
  push:*)'` and the gh forms for a default-mode launch.
- Rejected: a user-settings `autoMode.environment` entry (the operator's,
  outside the repository, and the docs ignore project files on purpose;
  axis: ownership); a project `.claude/settings.json` allow rule (applies
  only after the trust dialog and admits any order at any phase, WO-195's
  reason; axis: phase binding); widening the first admission to any `git
  push` (admits unregistered remotes; axis: scope).

*B. The opt-in draft form.*

- `worktree publish WO-NNN --target-worktree --draft --branch <type>/<slug>
  --title "<title>" --body-file <path>` is legal when the order is
  `verified` with a recorded passing `verification-result` for a
  registered target. It writes a commit object from the target worktree's
  tree with `git commit-tree` (HEAD and index unchanged, so the executor
  rule and the gate's HEAD binding hold), pushes it to the declared
  branch, opens a draft pull request with the lint-checked title and body,
  and records `PullRequestOpened { draft: true, head }` in the target
  publication store. The closed-phase publish of the same order on the
  same branch pushes the reviewed commit with
  `--force-with-lease=<branch>:<recorded draft head>`, updates the title
  and body, marks the pull request ready (`gh pr ready`) and records it.
  One pull request per order and no second branch. A draft at `active` or
  `ready-to-verify` refuses naming the phase; a second draft at the same
  head reports already published.
- Core declares no draft step and no actor; the instance's order names
  both (the fork's D8 reopen condition is this form landing). A criterion
  whose evidence is the draft's workflow runs is the instance's to place
  at final review (the planning document §4, the fork prompt).
- Rejected: the fork's hand route (a WIP commit on `wo-NNN`, a second pull
  request, an undo at final review; axis: one pull request); a kit-wide
  draft at verified (the operator: the route is the fork's; axis:
  ownership); a fixed actor (the instance names it; axis: the same).

*C. Close.*

- `classes.<id>.disposable` and `repositories.<id>.disposable`: arrays of
  relative paths (no `..`, no absolute, no symlink as a target); the
  registration composes class then repository, and nothing removes a class
  entry. At close, in the target worktree, every ignored path under a
  declared disposable path is deleted before the ignored-material
  judgment; in the base checkout, an untracked file that the fetched
  base's ignore rules ignore and that lies under a declared disposable
  path is deleted; an untracked file the fetched base ignores but no
  declaration covers does not block the fast-forward and is listed in the
  receipt; undeclared ignored material in the target worktree still
  refuses, naming each path once. The base judgment builds a temporary
  exclude file from the fetched base commit's `.gitignore` blobs and
  runs `git check-ignore --no-index` against it, never the pre-merge
  working copy's rules.
- The refusal reads: "undeclared ignored material; declare it disposable
  in the registration or remove it; regenerable build output is deleted,
  never moved to scratch". The release-close profile in `contributor.ts`
  gains: preservation is for operator material, evidence and intake;
  regenerable output is deleted; never move build output to scratch or
  offer to restore it.
- The target gate records `baseCheckoutWrites` on each command's row: the
  untracked files `git -C <base> ls-files --others --exclude-standard`
  lists after the command and not before (no `--ignored` scan), as an
  advisory the close receipt repeats.
- Rejected: deleting every ignored path at close (an operator note or a
  `.env` would go; axis: declared scope); judging the base after the
  fast-forward (moving a branch under unjudged files is the harm the check
  prevents; axis: ordering).

*D. Releases.*

- `repositories.<id>.release: { "policy": "declared" }` (absent means
  today's `no-release`) with `release.close` in the grant's
  `allowedEffects` for that repository, and the order header `**Target
  release classification:** patch | minor | major`. At `release close
  --publish`, after the target branch is proven merged, the close computes
  the next tag from the target's reachable `v*` tags (none means
  `v0.1.0`), creates the annotated tag on the merged base commit, pushes
  it and creates the target's GitHub Release with the order's reviewed
  notes; `--dry-run` previews; an equal tag on the same commit is an
  idempotent retry; a differing one refuses. The receipt's `publication`
  carries `target: { repositoryId, tag, release }`.
- The starter refresh pushes core's annotated release tag name onto the
  refresh commit of each export sibling and creates the sibling's GitHub
  Release pointing at it, with a one-line body naming core's Release; a
  retry finds both and reports current; a sibling tag at another commit
  refuses by name; the refresh row records the tag.
- Rejected: a target release on every close (the operator: not automatic;
  axis: opt-in); copying core's Release body onto the sibling (it names
  core's changes; axis: scope).

*E. Remote branches.* No deletion by the kit: with one pull request per
order the forge's delete-on-merge setting removes the merged head branch
(DotLn-Angular, 2026-10-18); the kit README names the setting.

**Deliverables:** the admission class, the fallback writer and remover,
the Codex rule generator and the printed lines; the `--draft` form and
the reuse; the `disposable` and `release` keys with their close and
release behavior; the gate advisory; the sibling tag and Release; the role
and refusal text; the fixture cases; the qualification record;
`docs/evidence/WO-221/`; the kit README and product 07 write-backs.

**Acceptance criteria (all required)**

1. Admission: in a fixture launchpad with a registered repository and a
   recorded target worktree for the dispatched order at phase `verified`,
   the hook input for `git -C <target> push -u origin wo-NNN` and for
   `gh pr create --draft --repo <registered>` returns `permissionDecision:
   allow` with a reason naming the registration; the same inputs for an
   unregistered path, another remote URL, another branch, a bare
   `--force`, phase `active`, or a grant lacking `repo.push` return no
   admission; a `permissions.deny` match is still denied. Cases run under
   the suite that declares `harness-host.ts`.
2. Fallback: with `hostRules: "literal"` in the registration, `worktree
   start` of a target order writes exactly that order's literal rules
   between the markers in the main checkout's `.claude/settings.local.json`
   and `release close` removes them; without the key it writes nothing;
   `harness check` reports a stale rule; no rule names a path outside the
   order's worktree or a remote other than the registered one.
3. Codex and Copilot: the emitted `.codex/config.toml` carries one
   generated prefix rule per registered repository and none for an
   unregistered one; `worktree start` prints the `--add-dir` and
   `--allow-tool` lines for a target order and nothing for a launchpad
   order.
4. Qualification: `docs/evidence/WO-221/host-qualification.md` records,
   for Claude Code at its current version in auto mode, Codex at its Auto
   default and Copilot at its default, one bounded episode each in a
   scratch launchpad registered against a scratch GitHub repository under
   the operator's account, running the draft form at `verified` and the
   publish at `closed` with no operator approval and no edit to user
   settings; each row names the host version, mode, the commands, the
   admission or rule that carried each, and any denial; a host that
   denies is recorded `blocked` with the fallback that then carried it,
   and the Known issues name it. The operator launches the episodes; the
   order's fallback for an episode not run by handoff is a `blocked` row
   naming the launch command.
5. Draft: at `verified`, the draft form leaves HEAD and `git status
   --porcelain` of the target worktree unchanged, pushes the declared
   branch to the fixture remote, creates a draft (the fixture gh records
   `--draft`) and records `PullRequestOpened { draft: true, head }`; at
   `closed` with a passing review, the publish pushes with
   `--force-with-lease=<branch>:<draft head>`, updates the title and body,
   marks ready and records; a draft at `active` or `ready-to-verify`
   refuses naming the phase; a second draft at the same head reports
   already published.
6. Close: a fixture where the target worktree holds `node_modules/`,
   `.nx/`, `dist/` and `.angular/`, the base checkout holds a stray
   `.angular/cache` untracked at the base and ignored after the merge, and
   the class declares the four plus `coverage/` disposable: `release close
   --publish` completes, deletes them and lists them in the receipt; a
   stray `.env` in either place refuses once naming the path and the
   registration remedy; no close path creates an entry under the scratch
   root.
7. Text: the release-close profile and the refusal name deletion of
   regenerable output and never a move or a restore; the emitted skill
   carries the sentence (`node scripts/harness.mjs check`).
8. Advisory: a gate command that writes an untracked file into the clone's
   base checkout records `baseCheckoutWrites` naming it on the gate row; a
   command that writes none records an empty list.
9. Target release: with `release.policy: declared` and `Target release
   classification: minor`, the close tags the merged base `v0.1.0` when
   the target has no tag, creates the Release through the fixture gh and
   records it; without the policy it reports `no-release`; a retry reports
   current; a tag at another commit refuses.
10. Starter tags: the refresh fixture pushes core's tag name onto the
    refresh commit and creates the sibling's Release; a retry reports
    current; an in-instance `preview --from <tag>` resolves it.
11. Write-backs: the kit README and product 07 state that trust comes
    from the registration and the kit, that the draft form is opt-in and
    the instance names its actor, the `disposable` and `release` keys,
    the starter tag, and the forge's delete-on-merge setting; `npm run
    publication:check` passes.
12. `npm test -- --review` and `npm run test:docs` green; `git diff
    --check` clean; no new dependency; the authority and harness editions
    re-minted deterministically; no live feedback episode owed.

**Preflight:** `npm test -- --only harness` for steps 1 to 3;
`npm test -- --only harness-fixtures` for step 2;
`npm test -- --only target-publish` for steps 6 and 7;
`npm test -- --only target-worktree` for steps 8 to 10;
`npm test -- --only launchpad-planning` for step 4;
`npm test -- --only release` for steps 12 and 13;
`npm test -- --only siblings-fixtures` for step 14;
`npm test -- --only skeleton` for step 11;
`npm test -- --only configuration-root` for every script step;
`npm run test:docs` for steps 16 to 19; each under
`node scripts/harness.mjs bounded --`; then the handoff gate the
executor's role text names at the base.

**Execution plan (the executor follows these steps in order; observed at `32f9653f`, 2026-10-18):**

1. `packages/skeleton/src/harness-host.ts` (`releaseCloseAdmission` and
   the hook response at line 1296): add `registeredTargetAdmission` with
   the clauses of Design A, composed before the first admission's
   fallthrough; read the registration, the clone map and the order's
   phase through the same readers the first admission uses. Check: the
   suite that declares the file (`npm test -- --review --list` names it)
   under `node scripts/harness.mjs bounded --`.
2. The fixture file that suite declares: the admission cases of criterion
   1, one per clause, plus the deny case. Check: the same suite.
3. `scripts/lib/harness.mjs` (`checkHarness`, the `.claude/settings.json`
   and `.codex` emit paths): the Codex prefix-rule generator from the
   registration, the stale-rule report for the literal fallback, and the
   emitted settings unchanged otherwise. Check: `npm test -- --only
   harness`.
4. `scripts/lib/config.mjs` (`validateClasses`, `validateRepositories`,
   `SECTION_KEYS` unchanged): `disposable` on classes and repositories,
   `release.policy`, `hostRules`, each validated as Design C and D say,
   with the example configuration updated. Check: `npm test -- --only
   launchpad-planning`.
5. `scripts/worktree.mjs` (`start`, the target branch): the literal-rule
   writer under `hostRules: "literal"` and the printed `--add-dir` and
   `--allow-tool` lines; `scripts/release.mjs` (`close`): the remover.
   Check: `npm test -- --only target-worktree` and `npm test -- --only
   release`.
6. `scripts/lib/target-publish.mjs` (`publishTargetWorktree`,
   `publishBoundTargetCommit`): the `--draft` branch (phase `verified`,
   `git commit-tree`, push, draft creation, the record) and the reuse
   branch at `closed` (force-with-lease against the recorded head, edit,
   ready, record). Check: `npm test -- --only target-publish`.
7. `scripts/test-target-publish.mjs`: the cases of criterion 5. Check:
   the same suite.
8. `scripts/lib/target-worktree-close.mjs` (`closeClean`,
   `closeTargetWorktree`, the refusal at line 424): disposable deletion in
   the worktree and the base, the fetched-tree ignore judgment, the
   receipt rows and the new refusal text. Check: `npm test -- --only
   target-worktree`.
9. `scripts/test-target-worktree.mjs`: the close fixture of criterion 6
   and the `.env` refusals. Check: the same suite.
10. `scripts/lib/target-gate.mjs`: the `baseCheckoutWrites` advisory per
    command row, and its case in `scripts/test-target-harness.mjs` or the
    suite that declares the file. Check: that suite.
11. `packages/skeleton/src/loadouts/contributor.ts` (the `release-close`
    profile): the deletion sentence; then `npm run build` and `node
    scripts/harness.mjs emit`. Check: `npm test -- --only skeleton` and
    `node scripts/harness.mjs check`.
12. `scripts/release.mjs` (the target branch at line 2455): the declared
    target release of Design D, the receipt's `target` publication row and
    the dry-run preview. Check: `npm test -- --only release`.
13. The release fixture that suite declares: the cases of criterion 9.
    Check: the same suite.
14. `scripts/lib/starter-refresh.mjs` and `scripts/lib/siblings.mjs`: the
    tag push and the sibling Release, the retry and the refusal, the row's
    `tag` field; the case in the `siblings-fixtures` suite. Check: `npm
    test -- --only siblings-fixtures`.
15. `scripts/launchpad.mjs` (`previewFromRevision`): accept a tag name in
    `--from`; its case. Check: `npm test -- --only launchpad-planning`.
16. `docs/evidence/WO-221/host-qualification.md` (new): the three rows
    of criterion 4 as run, or `blocked` with the launch command; the
    scratch launchpad and repository named only as scratch. Check: the
    file holds three rows.
17. `scripts/kit/README.client.md` §First steps and §Kit files and
    instance files, and `docs/repositories/README.md`: the registration
    keys, the draft form as opt-in with the instance naming its actor, the
    printed lines, the delete-on-merge setting. Check: `npm run
    test:docs`.
18. `docs/product/07-execution-guide.md` §Workflow closeout and releases
    (the target close paragraph, the starter refresh paragraph) and
    §Operator resume phrases (the `worktree publish` row): the declared
    disposable paths, the fetched-tree judgment, the target release, the
    sibling tag, the draft form. Check: `npm run publication:check`.
19. `docs/evidence/WO-221/decisions.md` and `README.md`: the decisions
    of each part with their rejected options, the qualification's
    outcome and the fallback setting it chose; then `npm run meta`.
    Check: `npm run meta -- --check`.
20. Handoff per §Discipline: the Preflight suites, `npm test -- --review`
    once, `npm run test:docs`, `npm run resume -- implementation-ready`
    with attestation flags.

**Evidence gate:** the Preflight suites; `npm test -- --review`;
`npm run test:docs`; the qualification record; the handoff gate. No
model run beyond the three host episodes.

**Write-back duty:** criterion 11 and steps 17 and 18.

**Known issues and carry-ins:**

- FUP-dbced48c3d572461 and FUP-81c8f4915c7790d3 are carry-ins by id; this
  order takes the platform share of the second only.
- Whether a hook's `allow` pre-empts the Claude Code classifier is
  unstated in the published docs; criterion 4 decides it and the fallback
  exists for a `no`. Codex and Copilot project-level trust depends on the
  operator having trusted the instance directory once, which any use of
  those hosts there already needs.
- The qualification spends the operator's credits once per host; an
  episode the operator has not run by handoff is a `blocked` row.
- WO-219 edits `harness-host.ts` for its rows; the second of the two to
  run rebases on the first.
- The fork's own route, actor, criterion placement, registration edits
  and cache pin are the fork's planning pass's (the planning document's
  fork prompt), not this order's.

**Non-goals:** a kit-default draft step or actor; trust for any repository
the registration does not name; edits to any user settings file; deleting
remote branches; a release of the target without the declared policy;
instance-declared lifecycle routes printed at transitions (a candidate in
the map); marking core-operator decisions in kit text for instance
override (a candidate in the map); rewriting any filed report.

**Operator-review assumptions**

1. The three host qualifications are the operator's to launch, as
   WO-146's were; the order names the launch commands and records
   `blocked` otherwise.
2. The fallback's literal rules live only in the main checkout's untracked
   local settings, between markers, for the order's lifetime.
3. The starter's tag carries core's name (`v0.85.0` on both), which the
   operator confirmed as the way a fork names a release.
4. Position 1 of the serial queue, before WO-217, on the 2026-10-18
   dispatch; the operator may move it by one sequence edit.
