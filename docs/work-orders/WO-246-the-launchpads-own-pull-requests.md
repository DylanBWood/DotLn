# WO-246 — The launchpad's own pull requests are opened by a helper on origin's repository: `npm run plan -- publish` and `launchpad update --publish` lint, push and open the pull request where the target publish does; a pull-request title in the form core itself uses, a gitmoji and a subject with or without a conventional type, passes the lint; the hook refuses a `gh pr` or `gh issue` command that names no repository in a clone whose origin and upstream differ; and the kit guide names the rule (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Release classification:** minor. Two new helper forms, one hook refusal,
one lint admission; no new operator phrase. Assigned at activation under the
standing opt-out default.
**Cost:** adds `scripts/lib/launchpad-publish.mjs` (new):
`publishLaunchpadBranch(root, { kind, title, bodyFile, base })`, which
refuses on `main` and off the kind's branch shape, proves `gh` and its login
for the repository origin's push URL names (`ensureGh`, `pushUrl` and
`resolveGitHubPushTarget` in `scripts/lib/github-repository.mjs` 93 to 125
and 144 to 172), lints the title (`pr-title`) and the body (`pr-body`)
through `checkOutwardArtifact` with the local-terms list and the
AI-attribution refusal the target publish applies, pushes the branch to
origin, opens the pull request with `gh pr create --repo <origin selector>
--head <branch> --base <base>` (the target publish's form,
`scripts/lib/target-publish.mjs` 1259 to 1272) and prints its URL; `plan
publish --title <title> --body-file <path>` in `scripts/refute-plan.mjs` (a
`planning/` branch with its planning document present) and `update
--publish --title <title> --body-file <path>` in `scripts/launchpad.mjs`
(the update branch once the merge, the emit and the lineage index are
committed); in `packages/skeleton/src/harness-host.ts`, beside the
literal-redirect and known-destination refusals (WO-135, WO-144), one
refusal: a `gh pr` or `gh issue` command with no `-R`/`--repo` argument and
no `GH_REPO` in the judged command, in a checkout whose `origin` and
`upstream` remotes name different repositories and whose gh default
repository is unset (the form gh documents for `gh repo set-default`, read
from the published gh page at execution), refused naming `-R <origin
selector>`; in `scripts/lib/outward-lint.mjs` (691 to 709) the `pr-title`
kind admits a leading gitmoji followed by a subject with no conventional
type, the `commit` kind unchanged; cases in `scripts/test-outward-lint.mjs`
(120 to 146), `scripts/test-target-publish.mjs` (a target title in core's
form passes), `scripts/test-harness.mjs` (the refusal in a two-remote
fixture; admitted with `-R`, with one remote, with the default set),
`scripts/test-plan-refutation.mjs` and `scripts/test-launchpad-update.mjs`
(the helpers against a local bare origin and a fake `gh` on the path, as the
target publish's fixtures use); the planner role text
(`packages/skeleton/src/loadouts/contributor.ts` 270) names `npm run plan --
publish`; the kit guide (`docs/KIT.md` once WO-245 merges, otherwise
`scripts/kit/README.client.md`) §Taking upstream updates and §Planning in
this instance name the helpers and the `-R <fork>` or `gh repo set-default`
rule for any raw `gh` a session still spells; product 07 §Operator-opened
planning pass (the push and the pull request through the helper). Removes:
the session spelling raw `gh pr create` for the launchpad's own branches,
the silent resolution of a fork's `gh` reads and writes to its parent (the
fork's #1 opened on the starter on 2026-10-30), and the type the lint forces
into a target title that core's own titles never carry (the fork's
DotLn-Angular workflow that prepends a gitmoji for the type). Wall-clock:
the refusal is one regular-expression match and one read of the checkout's
Git configuration per judged `gh` command, measured before and after and
recorded in the decisions; the helper replaces the push and the `gh` call
the session made. Context bytes: this file, about 16,000. Commands: `plan
publish` and `update --publish`, new. Tokens: unknown until run. Steps: 8.
Re-mints: `harness-host.ts` and `contributor.ts` are runtime sources
registered in `scripts/lib/evidence-sources.mjs` (187, 192, 287, 292, 360,
365), so each edition they stale is re-minted deterministically; no
feedback-judged file changes, so no live feedback episode; `harness-host.ts`,
`contributor.ts`, `scripts/refute-plan.mjs` and `scripts/launchpad.mjs` are
declared machinery sources, so `npm test -- --review` runs before handoff.
**Nomination provenance:** the DotLn-Enterprise-Starter fork's items 6 and 9
of its second pass of 2026-10-30, carried in the operator's planning dispatch
of 2026-10-31 (ignored capture
`docs/intake/notes/planning-kit-guide-home-fork-block-and-drive-returns-2026-10-31.md`,
SHA-256 `be49aeb50d95aac99a5dace4ca1aa8b4aa8a719f9e1a947fe5884be00e838180`):
item 6 as the fork's addendum of 23:17Z revised it (the helper, the hook
refusal, the guide sentence; the fork's #1 opened on the parent, closed with
a comment and reopened as #41; its row FUP-49dda4781fa64b25 keeping `gh repo
set-default` as the setting that closes the gap there today), and item 9
with the fork's addendum 2 of 23:27Z (the operator's rule is a gitmoji and
the subject for pull requests and conventional commits for commits; core's
#255, #257 and #258 carry no type; the fork's C6, FUP-f85ede7a356345c5).
Filed by the
[2026-10-31 pass](../planning/kit-guide-home-fork-block-and-drive-returns-2026-10-31.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen: no
stop condition.
**Depends on:** WO-218 (closed, v0.87.0: D043 admitted the gitmoji before the
type, the lint this order widens); WO-221 (closed: `ensureGhFor` and the
push-URL binding); WO-157 (closed: `pushUrl` and the host-created push);
WO-135 and WO-144 (closed: the hook's command judgment this refusal joins);
WO-245 (planning-deferral: the guide's file, `docs/KIT.md` or the kit
README, is known once WO-245 merges; step 7 names both).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-218",
    "relation": "satisfied-by-close",
    "reason": "the gitmoji admission before the conventional type that this order widens for pull-request titles"
  },
  {
    "workOrderId": "WO-221",
    "relation": "satisfied-by-close",
    "reason": "ensureGhFor and the push-URL binding the helper proves the repository with"
  },
  {
    "workOrderId": "WO-157",
    "relation": "satisfied-by-close",
    "reason": "pushUrl and the host-created push the helper reuses"
  },
  {
    "workOrderId": "WO-135",
    "relation": "satisfied-by-close",
    "reason": "the hook's command judgment the gh refusal joins"
  },
  {
    "workOrderId": "WO-144",
    "relation": "satisfied-by-close",
    "reason": "the known-destination refusals that survive grant failures, beside which the gh refusal sits"
  },
  {
    "workOrderId": "WO-245",
    "relation": "planning-deferral",
    "date": "2026-10-31",
    "reason": "the kit guide's file this order writes into is docs/KIT.md once WO-245 merges, otherwise the kit README; step 7 names both",
    "until": "WO-245"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/lib/github-repository.mjs`
(`parseGitHubTarget` 49; `resolveGitHubPushTarget` 93; `executeGh` 107;
`ensureGh` and `ensureGhFor` 116 to 140; `pushUrl` 144 to 172;
`parsePullRequestUrl` 346); `scripts/lib/target-publish.mjs` (the lint call
1205 to 1216; `gh pr create --draft --repo forge.selector` 1259 to 1272; `gh
pr view --repo` 1281); `scripts/lib/outward-lint.mjs` 691 to 712;
`scripts/outward-lint.mjs` 103 to 125 (the CLI kinds);
`scripts/test-outward-lint.mjs` 120 to 146 ("gitmoji requires type" at
134); `packages/skeleton/src/harness-host.ts` (the command judgment near
5795 to 5830: a known-destination refusal survives a grant failure);
`packages/skeleton/src/loadouts/contributor.ts` 270 (the planner's push and
pull request); `scripts/kit/README.client.md` 748 to 760 (the update route:
"pushes the branch to origin and opens a pull request against main") and
285 to 378 (planning in this instance); the fork's pass document of
2026-10-30 (`../DotLn-Instance/docs/planning/concept-batches-and-quality-passes-2026-10-30.md`)
§Addendum of 23:17Z and §Addendum 2 of 23:27Z;
`docs/evidence/WO-218/decisions.md#wo-218-d043`; product 07 §Operator-opened
planning pass (the push and the pull request as the dispatch's two
authorized effects).

**Objective:** A session never spells `gh` for the launchpad's own pull
requests: the planning pass and the update route each call one helper that
proves the repository origin names, lints the title and body as the target
publish does, pushes the branch and opens the pull request there. Where a
session spells `gh` anyway, a fork clone whose origin and upstream differ is
refused the forms that would silently reach the parent, with the remedy in
the message. A pull-request title in the form core itself uses passes the
lint everywhere, so a fork needs no workflow to retitle.

**Observed gap (dated 2026-10-31 at `main` `c27abd53`):**

- No `gh` command is judged by the hook: `packages/skeleton/src/harness-host.ts`
  names none (searched for `gh pr`, `gh issue`, `gh repo`); under
  `scripts/lib/` the only `gh` string outside the GitHub helpers is
  `harness-prune.mjs` 149.
- The planner role says the pass "pushes that branch and opens its :memo:
  pull request" (`contributor.ts` 270), and the kit README's update route
  says the session "pushes the branch to origin and opens a pull request
  against main" (748 to 760); both are done with raw `git push` and `gh pr
  create` by the session. The target publish names `--repo forge.selector`
  on every `gh` call (`target-publish.mjs` 1259 to 1285) and lints branch,
  commit, title and body first (1205 to 1216).
- In a clone with an `upstream` remote, `gh` resolves its default repository
  to the fork's parent unless `gh repo set-default` was run. The fork's
  session opened its update pull request as
  DylanBWood/DotLn-Enterprise-Starter#1 on 2026-10-30, closed it with a
  comment and reopened it as the fork's #41; its earlier `gh pr list` and
  `gh issue list` reads had reported nothing from the parent (the fork's
  item 6 and its row FUP-49dda4781fa64b25).
- The lint's `pr-title` kind requires `type(scope)?: subject` after an
  optional gitmoji (`outward-lint.mjs` 691 to 709; the case "gitmoji
  requires type" at `test-outward-lint.mjs` 134 refuses `✨ Handle input`).
  Core's own merged titles, `:sparkles: One phrase drives an order through
  its lifecycle…` (#258) and `:memo: Plan the work-setup pass…` (#257), carry
  no type; applied to them the lint would refuse. The fork's 2026-10-18 pass
  added a DotLn-Angular workflow that prepends the gitmoji for the type to
  meet the lint of that day (its addendum 2 of 2026-10-30 traces the drift);
  the operator's rule is a gitmoji and the subject for pull requests and
  conventional commits for commits.

**Design (scope discipline):**

- **One helper, two doors.** `publishLaunchpadBranch` does for the
  launchpad's own branch what the target publish does for a registered
  target: the repository is origin's push URL and nothing else, the lint
  runs first, and the push and the `gh pr create --repo` call name it.
  `plan publish` admits only a `planning/` branch with its planning document
  present; `update --publish` admits only a branch whose HEAD carries the
  merge the update preview planned (the `UPSTREAM.md` provenance of the
  previewed revision) with the emit and the lineage index committed.
  Rejected: one generic publish for any branch (axis: an order's branch has
  its own publish with its lifecycle preconditions, and a free form is a way
  around them). Rejected: a draft pull request (axis: the planning and
  update pull requests are opened ready; the target publish's draft form
  serves a verified phase this route has no equivalent of).
- **The refusal reads the clone, not the network.** The judgment reads the
  checkout's Git configuration for the two remotes and the gh default (the
  form gh documents, read at execution; a host that documents another form
  costs no failed verification, since the criterion names the behavior),
  compares the parsed repositories, and refuses only the silent case. `gh
  repo set-default`, `gh auth`, `gh --version`, and a command naming
  `-R`/`--repo` or `GH_REPO` are admitted; a clone with one remote sees no
  change. Rejected: running `gh repo view` inside the hook (axis: a network
  call per judged command). Rejected: wrapping every `gh` form (axis: the
  target publish already wraps the target's, the launchpad's own two are
  this order's, and the rest are the session's reads, which the refusal
  protects where they would mislead).
- **The lint admits what core writes.** A title is either `type(scope)?:
  subject`, optionally gitmoji-prefixed, or a gitmoji and a subject; a bare
  subject stays refused (`subject.shape`); the `commit` kind keeps the
  conventional type. Rejected: an instance-declared title convention in
  `dotln.config.json` (axis: both forms are core's own practice; a
  declaration would exist only to refuse one of them, which nobody asked
  for; reopen if an instance wants to refuse a form).
- **Live-run surfaces at the base.** `ensureGh`, `pushUrl`,
  `parsePullRequestUrl`, the lint and its CLI, the hook's judgment site and
  the target publish's fake `gh` fixture: exist. The helper, the two doors,
  the refusal and the lint admission: absent.

**Execution plan (the executor follows these steps in order; observed at `c27abd53`, 2026-10-31):**

1. `scripts/lib/outward-lint.mjs` 691 to 709: the `pr-title` admission;
   `scripts/test-outward-lint.mjs` 120 to 146: `✨ Handle input` and `:memo:
   Plan the pass` admitted as `pr-title` and refused as `commit`; `fix:
   handle input` and `:sparkles: feat: handle input` admitted for both;
   `Handle input` refused for both. Check: `npm test -- --only outward-lint`;
   `npm test -- --only target-publish`.
2. `scripts/lib/launchpad-publish.mjs` (new): `publishLaunchpadBranch` and
   its fixture helper with a local bare origin and the fake `gh`. Check:
   `npm test -- --only plan-refutation` and `npm test -- --only launchpad`
   once steps 3 and 4 wire the doors.
3. `scripts/refute-plan.mjs`: `plan publish --title <title> --body-file
   <path>` (the branch, the document, the helper; the usage line at 77 gains
   it). Check: `npm test -- --only plan-refutation`.
4. `scripts/launchpad.mjs`: `update --publish --title <title> --body-file
   <path>` (refuses on `main`, with uncommitted changes, or before the merge
   is committed). Check: `npm test -- --only launchpad`.
5. `packages/skeleton/src/harness-host.ts` (the command judgment): the
   refusal, its admitted forms and the remedy in the message; the measured
   cost per judged `gh` command before and after, recorded in the decisions;
   the fixture in `scripts/test-harness.mjs` with a two-remote clone. Check:
   `npm test -- --only harness-fixtures`; `npm test -- --only harness`.
6. `packages/skeleton/src/loadouts/contributor.ts` 270: the planner pushes
   and opens through `npm run plan -- publish`; the other roots unchanged.
   Check: `npm test -- --only harness`; `npm test -- --only harness-context`
   (the planner root against its ceiling under the standing route).
7. Write-backs: the kit guide (`docs/KIT.md` once WO-245 merges, otherwise
   `scripts/kit/README.client.md`; which one is known at activation)
   §Taking upstream updates (the update route through `update --publish`;
   one sentence naming `-R <fork>` or `gh repo set-default` for any raw `gh`
   a fork's session still spells) and §Planning in this instance (`plan
   publish`); product 07 §Operator-opened planning pass (the two effects
   through the helper); `docs/evidence/WO-246/decisions.md` (the refusal's
   cost; the gh default's documented form with the page and date it was read
   from); re-mint any edition the runtime sources stale; `npm run meta`;
   `node scripts/lineage.mjs index --check`; `npm run publication:check`.
8. Handoff: integrate `main` first when it has moved (WO-233's rule);
   finish source edits; `npm run format` and `npm run sync`; the three
   fresh independent reviewers the executor root requires; one `npm test
   -- --review` in the background awaited with `node scripts/harness.mjs
   evidence --wait`; `docs/evidence/WO-246/handoff.md`; `npm run test:docs`
   once after the last document edit; `npm run resume --
   implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the lint admission with its cases; the helper and its two
doors; the hook refusal with its fixture and measured cost; the planner
role's sentence; the write-backs.

**Acceptance criteria (all required)**

1. The lint admits `✨ Handle input` and `:memo: Plan the pass` as `pr-title`
   and refuses both as `commit`; `fix: handle input` and `:sparkles: feat:
   handle input` stay admitted for both; `Handle input` stays refused; the
   target publish's fixture passes a title in core's form.
2. On a `planning/` branch in a fixture clone with a local bare origin and a
   fake `gh`, `plan publish` lints the title and body, pushes the branch and
   calls `gh pr create --repo <origin selector> --head <branch> --base
   main`, printing the URL; on `main`, on a branch of another shape, with a
   refused term in the body, or with AI attribution, it refuses before any
   push; on an update branch `update --publish` does the same and refuses
   before the merge is committed.
3. In the harness fixture, a clone whose `origin` and `upstream` name
   different repositories refuses `gh pr list`, `gh pr create --title x`,
   `gh issue list` and `gh pr view 1`, naming `-R <origin selector>`; the
   same commands with `-R` or `--repo`, with `GH_REPO=` set in the command,
   after the gh default is set in the form gh documents, and in a clone with
   one remote are admitted; `gh repo set-default` is admitted; the judgment's
   duration is recorded.
4. The emitted planner root names `npm run plan -- publish`; `harness check`
   passes and the planner root's bytes are recorded against its ceiling.
5. The kit guide and product 07 state the helpers and the rule; `npm run
   publication:check` is green.
6. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Preflight:** `npm test -- --only outward-lint` and `npm test -- --only
target-publish` for step 1; `npm test -- --only plan-refutation` for steps
2 and 3; `npm test -- --only launchpad` for steps 2 and 4; `npm test --
--only harness-fixtures` and `npm test -- --only harness` for step 5; `npm
test -- --only harness` and `npm test -- --only harness-context` for step
6; `npm run test:docs` when a document changes; each under `node
scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the cases of criteria 1 to 4 and the deterministic
re-mints of any edition the runtime sources stale; `npm test -- --review`
before `implementation-ready`, final review reusing the passing complete row
at the integrated code identity when one exists.

**Write-back duty:** as listed in step 7 and criterion 5.

**Known issues and carry-ins:**

- The refusal is a literal-command judgment, as every hook refusal is; a
  program that calls `gh` from inside a script is unobserved, and the role
  text keeps the rule (reopen: a pull request lands on a parent repository
  from a session under the hook).
- Codex tool calls are unhooked; there the rule is role text, and the fork's
  operator record already carries it (reopen: a Codex session opens a pull
  request on the parent).
- The gh default's stored form may change across gh versions; the criterion
  names the behavior and the executor reads gh's page at execution (reopen:
  a gh release stores the default elsewhere and the admitted case fails).
- The fork's workflow and its C6 (FUP-f85ede7a356345c5) go when the release
  that carries this order lands; the fork decides (reopen: the fork reports
  the lint refusing a title in the operator's form after this release).
- The helper's pull-request body is the session's reviewed text; the Change
  table and target checks of the target publish do not apply to the
  launchpad's own branches (reopen: a planning or update pull request needs
  a generated section).

**Non-goals:** wrapping an order's publish (the target publish and `worktree
publish` keep their forms); judging `git push` (the push of a planning or
update branch stays the session's where the helper is not used); a title
convention declaration; changing the `commit` lint; merging anything.

**Operator-review assumptions:** that the planning and update pull requests
are opened ready, not draft; that a bare subject stays refused; that core's
own planning passes move to `plan publish` through the role text, which this
pass's own pull request precedes. Reopen on the operator's word.
