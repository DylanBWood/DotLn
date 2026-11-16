# Census of the kit's stops (refusals, denials, failing checks)

Record of the [2026-11-16 planning pass](the-kit-stops-no-work-2026-11-16.md): a research worker's
report on the kit's stops: every refusal, denial and failing check, kept as the worker returned it, except that quotation marks were taken
off the passages that name the operator beside a quoted phrase, which the
document gate reads as quoting the operator. It is
that worker's reading of the tree at `38c333ab2`, not the pass's judgment;
the pass's document says which of its statements the pass checked and what
it decided from them. A statement it marks unverified is unverified.

Research worker output for the planning pass on branch
`planning/2026-11-16-the-kit-stops-no-work`, read at commit `38c333ab2`
(= tag v1.2.0 plus nothing in scripts/ or packages/). Read-only; nothing
under `docs/control/local/` was read.

## How to read this

Classes (as the brief defines them):

- **W** protects the user's work or prevents harm that cannot be undone
  (destroying uncommitted work, leaking a secret or private term,
  publishing or pushing something unreviewed, writing outside the project).
- **K** protects the kit's own records, bookkeeping, process order or
  document form.
- **H** host capability or version.
- **B** budget, cap or time bound.

Columns: **Off** = can an instance turn it off or down today, and by which
exact key ("no" = no key found). **Route** = does the message tell the
person a way forward: `yes`, `yes; override` (a way forward and also
`operator override:`), `override only`, or `no`. **Ships** = does the code
reach an exported instance / the starter.

How "Ships" was determined (verified by reading code):
`scripts/launchpad.mjs:274-325` (`KIT_FILES`) carries the whole `scripts/`
tree except ten excluded files (`:291-302`, e.g. `scripts/test-runner.test.mjs`,
`scripts/test-host-guard.test.mjs`), `packages/beacons`, the build-free
modules (`:243-270`) and each runtime package's `package.json`;
`RUNTIME_PACKAGES` (`:134-139`: kernel, compiler, skeleton, console) are
carried as compiled `dist/src` (`:142`, `:756-757`, `:988`); the export runs
its own `harness emit` (`:1408`) so `.claude/hooks/*`, `.claude/settings.json`
and the skills are generated inside the instance. `packages/browser-evidence`
is not carried. Gate rows whose `kit:` field starts `core-only:` are dropped
in an instance (`scripts/test-runner.mjs:2770-2784`); an instance's gate
runs only rows with `instance: "runtime"` (npm test) or `instance: "document"`
(npm run test:docs) (`:2750-2754`) plus the six `STRUCTURAL_TASKS`
(`scripts/lib/generated-artifacts.mjs:7-14`). So almost every stop below
ships; the exceptions are marked `no`.

Override reach (verified): in the launchpad/instance hooks, both
`operator override:` **and** `analysis:` skip the whole hook judgment — the
generated preamble returns the mode message and never calls
`runHarnessHook` when the saved mode is not `normal`
(`.claude/hooks/permissions.mjs:153-157,176-177,193-194`; generator
`packages/compiler/src/harness.ts:1220`, `packages/compiler/src/operator-control.mjs`).
The **target-worktree hooks have no operator-control preamble**
(`packages/compiler/src/harness.ts:1929-1938`), so neither control
suspends a stop in a sibling repository. Lifecycle scripts (`resume`,
`worktree`, `release`, `launchpad`, `plan`) do not read the operator-control
mode at all (no reference found in `scripts/*.mjs` outside
`scripts/operator-control.mjs`); override suspends only hooks.

Boundary of the search (what was and was not read):

- Read: every `DOTLN_*` code site in non-test `scripts/` and
  `packages/*/src`; the PreToolUse/Stop/SubagentStop/UserPromptSubmit
  decision paths of `packages/skeleton/src/harness-host.ts`
  (`evaluateHarnessHook` :6751, `evaluateExistingHarnessHook` :6843-7698,
  `runHarnessHook` :7960-8213, `runTargetHarnessHook` :8578-8947);
  `subagent-budget.ts`; `dispatch-bound.mjs`; the gate table in
  `scripts/test-runner.mjs:545-1055` and its instance selection; the main
  check sequence of `scripts/docs-check.mjs:2060-2290`;
  `structural-checks.mjs`; the throw sites of `resume.mjs` (115),
  `worktree.mjs` (72), the lifecycle libs `handoff-ledger.mjs`,
  `lifecycle-evidence.mjs`, `plan-first.mjs`, `planning-followups.mjs`,
  `plan-receipts.mjs` (checkPlanGate), `launchpad-publish.mjs`,
  `worktree-integration.mjs`; `release.mjs` and `launchpad.mjs` throw
  messages (one line each).
- Grouped, not itemised: argument/usage errors (`usage: ...`), I/O and
  integrity errors ("cannot read", "malformed"), and the ~87 refusal sites
  of `scripts/lib/target-publish.mjs` and ~40 of `scripts/lib/worktree-integration.mjs`
  (summarised as rows). Raw counts for scale: non-test `throw new Error`
  lines in scripts/ + packages/*/src = 2,525 at v1.2.0; most are usage or
  integrity errors, not policy stops.
- Not read: `scripts/drive.mjs` and the `drive-*` libs beyond the router
  codes; `scripts/siblings.mjs`, `lineage.mjs`, `reader.mjs`, `entropy.mjs`,
  `check-registrations.mjs`, `license-surfaces.mjs` internals (listed at
  the gate-row level only); `packages/kernel`, `packages/console`,
  `packages/compiler` beyond harness emission; Codex/Copilot-specific paths.
  Anything marked *unverified* below was not confirmed by reading code.

## 1. Launchpad / instance Claude Code hooks

Hard deny = PreToolUse `permissionDecision: "deny"` (`protocolRefusal`,
`harness-host.ts:5807-5816`). On UserPromptSubmit a "refusal" accepts the
prompt and only reports that the dispatch was not recorded
(`:5817-5825`); on Stop it is a message only (`:5826-5827`).

| ID | Stop (code / name) | file:line | Trigger | Protects | Class | Off | Route | Ships |
|---|---|---|---|---|---|---|---|---|
| S01 | DOTLN_DESKTOP_CONTROL_REFUSED (WO-251) | packages/skeleton/src/harness-host.ts:5687 (deny :5693; judged first :6764-6773) | a desktop-control or operator-browser tool/skill without the election | the operator's own signed-in sessions | W | yes: features.desktop-control=true (hook turns advisory) | yes (Playwright MCP / browser tests); no override | yes |
| S02 | Host settings deny: desktop/browser tools and skills | packages/compiler/src/harness.ts:542-550, :1598 → .claude/settings.json | same, enforced by the host | same | W | yes: features.desktop-control=true (rules not emitted) | host denial; hook advisory names `!` prefix or /permissions (harness-host.ts:6950) | yes |
| S03 | Host settings deny: ssh / scp / sftp | packages/skeleton/src/loadouts/contributor.ts:502, :517-519 → .claude/settings.json | any ssh/scp/sftp command | sending files to outside hosts | W | no (whether build.overlay can drop a kit deny rule: unverified) | host denial; advisory as S02 | yes |
| S04 | Host settings deny: npm publish | contributor.ts:506, :520 | `npm publish` | publishing unreviewed packages | W | no (unverified as S03) | host denial; advisory as S02 | yes |
| S05 | DOTLN_HARNESS_REFUSED gh-repository (WO-246) | harness-host.ts:2476-2496 (applied :6778-6787) | `gh pr`/`gh issue` naming no repo in a clone whose origin and upstream differ and gh default is unset | opening a PR/issue on the upstream by accident | W | no | yes; override (`-R`, `gh repo set-default`, then "Use operator override:") | yes |
| S06 | DOTLN_PLAN_FIRST_REFUSED (hook) | harness-host.ts:6315-6318, :6342, :6345-6348 | executor writes outside plan roots before plan approval; election unreadable | plan-first process order | K | yes: features.plan-first (default false; stop exists only when elected) | yes (plan-approved); no override | yes |
| S07 | DOTLN_HARNESS_REFUSED outside-project write (WO-144) | harness-host.ts:6531-6534 | write to a known destination outside the project with no role grant | writing outside the project | W | no key (grants come from role/equipment; build.overlay effect unverified) | yes; override ("Use operator override: for authorized recovery") | yes |
| S08 | DOTLN_HARNESS_REFUSED live-gate write (WO-135 "gate") | harness-host.ts:6603-6721 (applied :6953-6959) | any write, or any shell not on the read list, while a gate runs in this worktree | gate inputs/evidence stay the bytes the gate judged | K | no | yes (stop gate with `harness evidence --stop` or wait; read list); no override | yes |
| S09 | DOTLN_HARNESS_REFUSED planning-branch write (WO-135 "planning") | harness-host.ts:6027-6057 (applied :6960-6961) | any write outside docs/ and root *.md on a `planning/` branch | planning passes stay document-only | K | no | override only | yes |
| S10 | DOTLN_HARNESS_REFUSED writer isolation (WO-135 "writer") | harness-host.ts:7680-7695 (reason :5622-5635, text :3896-3923) | write while another session holds this worktree's writer reservation | concurrent writers clobbering uncommitted work | W | no | yes (`writer --show` / `--release`; operator `--release --force`); no override | yes |
| S11 | DOTLN_ROUTER_LAUNCH_REFUSED | harness-host.ts:7428-7431 | router session after the host denied its launcher | drive process order | K | no | yes (new drive phrase) | yes |
| S12 | DOTLN_ROUTER_SPAWN_REFUSED | harness-host.ts:7433-7443 | router spawns anything but the exact phrase/agent pair | drive process order | K | no | partial (names the rule) | yes |
| S13 | DOTLN_ROUTER_WRITE_REFUSED | harness-host.ts:7444-7459 | router writes or runs non-read shell | drive process order | K | no | partial (names the rule) | yes |
| S14 | DOTLN_WORKER_GATE_REFUSED (WO-250) | harness-host.ts:520-521 (applied :7464-7468) | review/refutation worker starts a test-runner gate | parent's writes not locked out by a worker's gate | K | no | yes (bounded single-test probe) | yes |
| S15 | DOTLN_HARNESS_REFUSED driven-helper writes | harness-host.ts:5202, :7469-7491 | a driven worker's helper agent writes outside its scratch or runs non-read shell | one writer per order worktree | K | no | partial (names read list) | yes |
| S16 | DOTLN_DISPATCH_BOUND (hook) (WO-234) | harness-host.ts:7496-7513 (message scripts/lib/dispatch-bound.mjs:444) | spawn, kit worker launch or complete gate after the role's wall-clock or complete-run bound | session length/cost | B | yes: docs/control/budgets.json dispatches.<role>.wallClockMs / completeRuns = null (executor today: "local-median", 20) | yes (`analysis:` + `accept-overrun`); no override | yes |
| S17 | DOTLN_SUBAGENT_CAP_REFUSED (WO-139) | packages/skeleton/src/subagent-budget.ts:407-414 (applied harness-host.ts:7528-7529) | worker uses per spawning session above the cap | spend | B | yes: budgets.json subagentCap = null (default 20) | yes (`accept-overrun subagentCap`) | yes |
| S18 | DOTLN_DRIVEN_BUDGET_REFUSED | subagent-budget.ts:681-686 (applied harness-host.ts:7531-7532) | a driven phase above drivenSessionCeiling (default 80) or its spawner cap | spend | B | yes: budgets.json drivenSessionCeiling = null; spawner cap via subagentCap | yes (as S17) | yes |
| S19 | DOTLN_HARNESS_INPUT_REFUSED | harness-host.ts:7987-7993, :8001-8010 | hook input not JSON or fails the decoder | hook protocol integrity | H | no | no | yes |
| S20 | DOTLN_WORKER_TASKS_RUNNING (SubagentStop block, once) | harness-host.ts:5843-5926 | a worker stops while its own background task runs | orphaned background tasks | K | no | yes (stop the task) | yes |
| S21 | DOTLN_HARNESS_REFUSED "not a legal dispatch in phase" (UserPromptSubmit, soft) | harness-host.ts:1538-1540 | a `resume:` phrase whose action is not legal in the order's phase | lifecycle order | K | no | yes (lists legal actions) | yes |
| S22 | DOTLN_HARNESS_REFUSED "dispatch ... failed" (soft) | harness-host.ts:1461-1463 | the lifecycle command the phrase runs exits non-zero | lifecycle record | K | no | partial (prints lifecycle output) | yes |
| S23 | DOTLN_HARNESS_REFUSED "briefing unavailable" (soft) | harness-host.ts:1503-1505 | dispatch already recorded but briefing cannot be printed | lifecycle record | K | no | no | yes |
| S24 | Dispatch refused during a live gate (soft) | harness-host.ts:1413-1424 | a `resume:` phrase while a gate runs | gate inputs | K | no | yes (gate stop text) | yes |
| S25 | Dispatch refused by writer isolation (soft) | harness-host.ts:1425-1454 | a `resume:` phrase while another session holds the writer | concurrent writers | W | no | yes (writer commands) | yes |
| S26 | Codex dispatch writer reservation | harness-host.ts:4186, :4242; scripts/resume.mjs:1768-1782 | a Codex dispatch while another holds the writer, or the runtime is unbuilt | concurrent writers / runtime | W | no | yes (bootstrap; writer commands) | yes |
| S27 | DOTLN_HARNESS_REFUSED commit-message boundary (git commit-msg hook) | harness-host.ts:8207-8224; emitted .claude/hooks/commit-msg.mjs (compiler harness.ts:1266) | commit message carries AI attribution | publishing attribution the owner forbids | W | no | no | emitted, but not installed as a Git hook in this checkout (no core.hooksPath, no .git/hooks/commit-msg — checked); how an instance installs it: unverified |

Checked and found **advisory, not a stop** in the launchpad hook (listed so
the count is honest): compiled authority not permitting an effect
(`harness-host.ts:7605`), shell classification gaps (`:8062-8086`, the
three commonest are journaled and not shown), runtime unavailable (same
lines), every feedback unit except a foreign writer — no-attribution,
no-lint-type-disables, read-your-own-output, verify-app-before-done,
no-partial-completion (`:7693-7696`), host permission denied (`:6950`),
outside-write guard unavailable (`:6810-6818`).

## 2. Target-worktree (sibling repository) hooks

Emitted into a registered target worktree from the instance's compiled
runtime (`packages/compiler/src/harness.ts:1856-1940`); every stop below is a
hard PreToolUse deny (`harness-host.ts:8582`), the target bundle carries the
permission hook plus the writer-isolation and attribution feedback units
(`harness.ts:1868-1872`), and **neither `operator override:` nor
`analysis:` suspends them** (no operator-control preamble,
`harness.ts:1929-1938`). In the launchpad the same classification and
authority judgments are advisories (S-advisory list above); here they deny.

| ID | Stop (code / name) | file:line | Trigger | Protects | Class | Off | Route | Ships |
|---|---|---|---|---|---|---|---|---|
| S28 | DOTLN_TARGET_RUNTIME_REFUSED | harness-host.ts:8924-8942; compiler harness.ts:1938 | launchpad runtime or target facts unavailable, worktree/runtime binding differs (:8597, :8607) — denies every tool call | target hook integrity | H | no | no | yes |
| S29 | DOTLN_TARGET_REFUSED "target effect classification unavailable" | harness-host.ts:8913-8921 | any shell command the classifier cannot read (e.g. `cd … &&`, `$(…)`, shell control syntax, options before a subcommand; reasons in harness-command.ts:1644-2194) | the compiled authority envelope | K | no | no | yes |
| S30 | DOTLN_TARGET_REFUSED "compiled authority does not permit <effect>" | harness-host.ts:8756-8762, :8864 | effect outside the envelope (deniedEffects contributor.ts:500-507: credentials, ssh, settings.user, sandbox.disable, remote.unapproved, package.publish; plus anything not allowed) | the envelope (mix of W effects and K scoping) | K | no | no | yes |
| S31 | DOTLN_TARGET_REFUSED "target shell requires worktree-root cwd" | harness-host.ts:8793-8798 | a shell command whose working directory is not the target root | classification scope | K | no | no | yes |
| S32 | DOTLN_TARGET_REFUSED "target shell destinations unavailable" | harness-host.ts:8871-8874 | a command whose write destinations cannot be computed | classification scope | K | no | partial ("host must run opaque commands") | yes |
| S33 | DOTLN_TARGET_REFUSED "delegation or interaction has no bounded worker adapter" | harness-host.ts:8893-8899 | Agent/Task spawn, re-task or interaction tool in a non-driven target session | worker accounting | K | no | no | yes |
| S34 | DOTLN_TARGET_REFUSED writable surface | harness-host.ts:8511-8575 | write to .git, .claude/settings.json, the bundle's hook files, CLAUDE.local.md, .dotln, linked/hard-linked paths, or outside the root | the installed guard bundle | W | no | no | yes |
| S35 | DOTLN_TARGET_REFUSED driven grants and roots | harness-host.ts:8663-8676 | driven role lacks order-worktree grant / roots differ | order binding | K | no | no | yes |
| S36 | DOTLN_TARGET_REFUSED worker gate | harness-host.ts:8635 | review worker starts a gate in a target | as S14 | K | no | yes (as S14) | yes |
| S37 | DOTLN_TARGET_REFUSED driven budget | harness-host.ts:8650-8660 (drivenAdmission) | as S18 inside a target | spend | B | yes: as S18 | yes | yes |
| S38 | DOTLN_TARGET_REFUSED writer reservation | harness-host.ts:8763-8778 | write while another session holds the paired writer | concurrent writers | W | no | yes (writer commands) | yes |
| S39 | DOTLN_TARGET_REFUSED launchpad live gate | harness-host.ts:8527-8540, :8876-8888 | target write/publication/commit while the launchpad's gate runs | launchpad gate inputs | K | no | yes (gate stop text) | yes |
| S40 | DOTLN_TARGET_REFUSED publication admission unavailable | harness-host.ts:8820-8834 | push/PR from a target without the registered-target admission | publishing unreviewed | W | no | partial | yes |
| S41 | DOTLN_TARGET_REFUSED "compiled feedback refused target effect" | harness-host.ts:8901-8915 | writer-isolation or attribution unit refuses in a target | concurrent writers / attribution | W | no | no | yes |

## 3. Lifecycle commands and their libraries

| ID | Stop (code / name) | file:line | Trigger | Protects | Class | Off | Route | Ships |
|---|---|---|---|---|---|---|---|---|
| S42 | Phase legality (`cannot perform action in phase`) | scripts/resume.mjs:1232-1237 | any lifecycle action not legal in the order's phase | lifecycle order | K | no | yes (legal commands) | yes |
| S43 | Off-ramp legality | resume.mjs:1240-1245 | waive/withdraw/etc. outside their phases | lifecycle order | K | no | yes | yes |
| S44 | Actor attestation must match host readback | resume.mjs:827-851 | `--effort`/`--source`/`--harness-version` differ from CLAUDE_EFFORT or the observed version | record accuracy | K | no | yes (the flags to use) | yes |
| S45 | Report actor header | resume.mjs:896-923 | VER/FINAL report lacks or mismatches its actor header | record form | K | no | yes (expected header) | yes |
| S46 | Work-order header Model/Effort lines | resume.mjs:560-657 | missing/duplicated/misplaced `**Model:**`/`**Effort:**` | record form | K | no | partial | yes |
| S47 | Withdrawn-order reactivation note | resume.mjs:1340-1369 | re-activating a withdrawn order without a new dated note | record history | K | no | yes | yes |
| S48 | Own-executor refusals (waive/defect/retract/correct) | resume.mjs:1393-1406 (used :2682, :2732, :2802) | the order's executor records an off-ramp on its own order | review independence | K | no | partial | yes |
| S49 | Activation: umbrella / dependencies / repository profile | resume.mjs:2041-2043, :2063-2091; scripts/lib/dependencies.mjs:301 | activating an umbrella, a blocked order, or an unknown/uncontained repo profile | sequence and registration | K | no | yes | yes |
| S50 | Plan-first approval (lifecycle) | scripts/lib/plan-first.mjs:120-137, :390; resume.mjs:2113-2152, :2166 | implementation-ready without an approved current proposal | plan-first process | K | yes: features.plan-first (default false) | yes | yes |
| S51 | Handoff ledger must judge every criterion | scripts/lib/handoff-ledger.mjs:331-356 | handoff.md absent, or a criterion unjudged/duplicated/undeclared | completion record | K | no | yes (line forms) | yes |
| S52 | Live-run criteria must cite receipts at the handoff identity | handoff-ledger.mjs:195-240 | a met criterion naming a live run cites no receipt at the current code identity | evidence record | K | no | yes | yes |
| S53 | Completion needs a passing product-gate row at the current code identity | handoff-ledger.mjs:575-597 | a criterion claims `npm test` and no passing row stands at the identity (any later edit displaces it) | evidence record | K | no | yes (commands) | yes |
| S54 | Completion needs a passing document-gate row | handoff-ledger.mjs:456, :618 | a criterion claims `npm run test:docs` (or docs changed) and no current passing row | evidence record | K | no | yes | yes |
| S55 | Final review needs a passing complete review row | handoff-ledger.mjs:665-719 | final-review-result without `npm test -- --review` passing at the integrated identity | evidence record | K | no | yes | yes |
| S56 | `git diff --check` at every completion | scripts/lib/lifecycle-evidence.mjs:52-59 | trailing whitespace / conflict markers in the tree | document form | K | no | partial (git output) | yes |
| S57 | Stored PR body criterion record (final-review pass, publish) | resume.mjs:2443-2459; scripts/worktree.mjs:1736 | the stored body's waived/defective criterion lines differ from the record | publication text matches record | K | no | yes | yes |
| S58 | target-records refusals | resume.mjs:2537-2545 | filing target records when not owed / filing fails | record placement | K | no | yes | yes |
| S59 | correct / waive / defect / retract / reopen-handoff record rules (~40 sites) | resume.mjs:2685-3305 | corrections that would change a verdict, move a report, bind a gate to other bytes, etc. | record immutability | K | no | yes (each names the route) | yes |
| S60 | accept-overrun validation | resume.mjs:2584-2650 | ceiling not larger than current value / malformed | budget record | B | n/a (it is the route out of S16/S17) | yes | yes |
| S61 | override-record / retraction from a closed order must run from main | resume.mjs:2877-2891, :3375-3377 | recording from a worktree that is not main | record placement | K | no | yes | yes |
| S62 | "no main-branch control-plane worktree found" | scripts/lib/git.mjs:327-333 (also order-worktrees.mjs:34); 18 call sites (resume.mjs:314, :2861, :3365, :3420; worktree.mjs:821, :1168, :1389; meta, gate-reuse, planning-document, planning-conditions, document-census, target-*) | any of those commands while no checkout has `main` checked out — e.g. the main checkout is on a `planning/` branch | locating the control plane | K | no | no | yes |
| S63 | Plan start requires clean main | scripts/refute-plan.mjs:433-438 | `npm run plan -- start` off main or with any dirty file | planning branch base | K | no | partial | yes |
| S64 | Plan start / plan check refuse a stale follow-up register | refute-plan.mjs:439, :572 → scripts/lib/planning-followups.mjs:664-670, :794 | `followups.json` differs from its projection | register bookkeeping | K | no | yes (`npm run meta` or `plan -- followups --sync`) | yes |
| S65 | Follow-up register writer lock | planning-followups.mjs:640-650 | lock directory present (interrupted writer) | register integrity | K | no | partial | yes |
| S66 | Plan refutation preconditions | refute-plan.mjs:703-710 | refuting an uncommitted subject, or re-rolling the same subject | review integrity | K | no | yes | yes |
| S67 | Planning/update publish door | scripts/lib/launchpad-publish.mjs:96-169 | wrong branch shape, uncommitted tree, refuse-mode private term in added lines, outward lint, body profile, AI attribution, origin mismatch | publishing unreviewed / private terms | W | partial: an empty private list refuses nothing; context-mode entries list only | yes | yes |
| S68 | Publish refuses while the private terms list is absent | launchpad-publish.mjs:64-73 | `docs/control/local/terms.txt` not registered | private-term screen precondition | W | yes: register an empty list ("an empty list refuses nothing") | yes | yes |
| S69 | Starter update needs the operator's in-session request | scripts/launchpad.mjs:3280-3289 | a planning/entropy session takes a newer starter release unasked | update authority | K | yes: features.auto-update-upstream=true | yes | yes |
| S70 | `update --apply` needs kit.applyInstanceActions | launchpad.mjs:1988-1992, :2174-2178 | applying kit instance actions without the opt-in | instance files | K | yes: dotln.config.json kit.applyInstanceActions=true | yes | yes |
| S71 | Starter update merge judgments (~17 sites) | launchpad.mjs:2617-3126 | merge base unreadable (grafts/shallow), incoming revision unknown/ambiguous, several meetings, `--take` misuse, a merge that drops files the instance changed | instance edits not silently lost | W | no | yes (each names the step) | yes |
| S72 | `update --finish` preconditions | launchpad.mjs:3333-3397 | not main, dirty tree, not one origin, not fast-forward | instance main history | K | no | yes | yes |
| S73 | Export destination and pinned inputs | launchpad.mjs:376-397, :1084-1127 | non-empty destination; work tree differs from HEAD; installed toolchain not the pin | overwriting a directory / reproducible export | W | no | yes | core only (export runs from core sources; `launchpad.mjs:1084-1087`) |
| S74 | `worktree start` from main only, umbrella, existing target/branch | worktree.mjs:1405-1453 | start from a non-main checkout, umbrella order, target dir or branch exists | control plane / no overwrite | K | no | yes | yes |
| S75 | `worktree start` host denies writes at the target dir | worktree.mjs:605-614 | host sandbox refuses the sibling directory | — | H | no | yes (grant via host permission flow) | yes |
| S76 | `worktree publish` needs a committed passing final review | worktree.mjs:1636-1645 | publishing an order not closed with a passing review | publishing unreviewed | W | no | yes | yes |
| S77 | `worktree publish` private terms / attribution | worktree.mjs:1660-1665, :1705-1723 | refuse-mode term in added lines or PR title; AI attribution in title/body | private terms; attribution | W | partial: term modes in the private list | yes | yes |
| S78 | `worktree finish/settle` preconditions | worktree.mjs:1880-1977, :1993, :519 | not merged, not closed, live gate, runtime build fails | closing reviewed work only | K | no | yes | yes |
| S79 | Worktree removal with a submodule | worktree.mjs:186-190 | removing a worktree holding a submodule | unpushed submodule commits | W | no | yes | yes |
| S80 | `worktree integrate`: intake backup, intent-to-add | scripts/lib/worktree-integration.mjs:311-334, :757-763 | ignored intake present without a named backup; intent-to-add entries | ignored intake / unstashable work | W | no | yes | yes |
| S81 | `worktree integrate`: host lanes held / live gate / phase | worktree-integration.mjs:705-723 | another task holds host lanes; a gate runs; phase not active/repairing/final-review | gate inputs / order | K | no | yes | yes |
| S82 | `worktree integrate` recovery refusals (~25 sites) | worktree-integration.mjs:380-1082 | conflicts, stash states, pending merge mismatches | not losing stashed work | W | no | yes | yes |
| S83 | Release close preconditions | scripts/release.mjs:2467, :2476, :3688, :3738-3781, :3848-3872 | not main, main not synced, order not closed, pending dispatch unrecorded, retraction, nested/existing tag | publishing only reviewed, merged work | W | no | yes | yes |
| S84 | Release close needs gh present and authenticated | release.mjs:3028-3042 | gh missing / not logged in | — | H | no | yes | yes |
| S85 | Release prepare preconditions | release.mjs:4818-4857 | wrong worktree, closed order, pending integration | version bookkeeping | K | no | yes | yes |
| S86 | Target publish / target draft (~87 sites) | scripts/lib/target-publish.mjs:93 (`refuse`), e.g. :1004-1011, :1207, :1354-1391, :1445-1466, :1507 | no passing final review/target gate, records in the change, bundle files in the change, attribution, origin mismatch, phase | publishing unreviewed to a sibling | W | no | yes (most name the route) | yes |
| S87 | dotln.config.json validation (incl. unknown `features` key) | scripts/lib/config.mjs:1228, :1328; scripts/lib/feature-registry.mjs:203-216 | any malformed or unknown key — every command that loads config stops | configuration form | K | no | yes (names known ids / `features -- list`) | yes |
| S88 | budgets.json validation | scripts/lib/process-budget.mjs:39, :68, :86, :225-234 | malformed budget values | configuration form | K | no | partial | yes |
| S89 | Build overlay / settings fragment validation | scripts/lib/build-overlay.mjs:14-20, :209-212, :238-246, :306-307 | an overlay that adds PreToolUse/SubagentStop/UserPromptSubmit hooks or is malformed | the kit's guards cannot be rewritten | K | no | yes | yes |
| S90 | Bounded probe past the dispatch bound | scripts/lib/bounded-command.mjs:59 | `harness bounded` after the bound | spend | B | yes: as S16 | yes | yes |
| S91 | Node / Git floor on harness and gate | scripts/harness.mjs:56-63; structural host task | Node or Git older than package.json engines | — | H | no | yes | yes |
| S92 | Drive refuses while an override is open | scripts/lib/drive-route.mjs:69 | `drive:` while the override mode is on | recovery before routing | K | no | yes ("operator override: off") | yes |
| S93 | DOTLN_PACKAGE_PUBLISH_REFUSED | package.json:31 (prepublishOnly); packages/{kernel,compiler,skeleton,console,beacons}/package.json; checked by scripts/license-surfaces.mjs:33, :143-147 | `npm publish` of any package | publishing packages | W | no | partial | runtime package.json files ship (`launchpad.mjs:281`); whether the instance's generated root package.json keeps prepublishOnly: unverified |

Internal, not person-facing: `DOTLN_ALLOCATION_REFUSED`
(`scripts/lib/control.mjs:14`, thrown :390, caught :1076). Fixture-only:
`DOTLN_PRIVATE_REFUSED`, `DOTLN_PROBE_REFUSED` (test and fixture files only).

## 4. Gate tasks that fail a run for reasons other than the code under test

Instance selection: npm test = structural six + kit-verify + `harness check`;
npm run test:docs = rows marked `instance: "document"`. Core runs more.

| ID | Stop (code / name) | file:line | Trigger | Protects | Class | Off | Route | Ships |
|---|---|---|---|---|---|---|---|---|
| S94 | format (prettier --check), structural + preflight | scripts/test-runner.mjs:547-554 | any file prettier would reformat | document/code form | K | no (prettier config/ignore are the instance's own files) | partial (prettier output) | yes |
| S95 | configuration-root | test-runner.mjs:557-562 | configuration/control-plane source declarations | configuration form | K | no | partial | yes |
| S96 | registrations | test-runner.mjs:563-565 (scripts/check-registrations.mjs) | registration records | records | K | no | partial | yes |
| S97 | declarations (machinerySources, fixture inputs, temporary-root owners) | test-runner.mjs:566-569; scripts/structural-checks.mjs:111-126 | a new script/fixture/temp root not declared | gate bookkeeping | K | no | yes (names the missing declaration) | yes |
| S98 | generated (stale generated artifacts: harness, meta, lineage, index, release-surfaces, siblings, runtime) | test-runner.mjs:570-573; generated-artifacts.mjs:31-80; structural-checks.mjs:178-196 | any generated projection out of date | generated records | K | no | yes (`npm run sync`) | yes |
| S99 | host: Node/Git floor | structural-checks.mjs:45-48, :60-62 | toolchain below engines | — | H | no | yes | yes |
| S100 | host: memory pressure, lane memory budget | structural-checks.mjs:49-66 | host at warning/critical pressure or lanes under budget | machine stability | H | down: budgets.json memory.gateShare / hostShare | partial | yes |
| S101 | host: file-events daemon > 1 GiB | structural-checks.mjs:76-108 | fseventsd resident above 1 GiB | machine stability | H | no | yes (`sudo killall fseventsd`) | yes |
| S102 | host: dispatch bound exceeded | structural-checks.mjs:55-56 | as S16, at gate start | spend | B | yes: as S16 | yes | yes |
| S103 | kit-verify (instance build row) | test-runner.mjs:529-537 | the carried runtime differs from KIT-MANIFEST.json | runtime integrity | K | no | yes (restore via export/update) | yes (instance only) |
| S104 | harness check | test-runner.mjs:953-959 | emitted hooks/skills/CLAUDE.md block differ from what emit would write | harness integrity | K | no | partial (`harness emit`) | yes |
| S105 | Host-confinement refusal | test-runner.mjs:2920-2943; scripts/lib/host-confinement.mjs:105-113 | a gate run inside a sandbox when selected suites need the outside | — | H | no | yes (run outside, or `--confined-partial`) | yes |
| S106 | Sync check time limit (30 s per check) | scripts/sync.mjs:141; generated-artifacts.mjs:38, :160-180 | a generated-artifact check slower than 30 s on a loaded host | time bound | B | no | yes ("rerun the check") | yes |
| S107 | release-surfaces (`release check-surfaces --local`) | test-runner.mjs:589-595 | version surfaces disagree with the order's declared version | release bookkeeping | K | no | partial (`release sync-surfaces`) | yes |
| S108 | license-surfaces | test-runner.mjs:639-644 | license files/markers disagree | license form | K | no | partial | yes |
| S109 | publication check | test-runner.mjs:755-760; scripts/check-publication.mjs:15-20 | publication index/outline form; plan-first conversation screen | publication form | K | no | partial | yes |
| S110 | docs-check: product shape (new receipt or candidate paragraph in a product doc) | scripts/docs-check.mjs:2096-2108 | a product document gains a receipt/candidate shape not in the baseline | document form | K | no | yes | yes |
| S111 | docs-check: entry point names a record | docs-check.mjs:2113-2117 | an entry-point section links a record | document form | K | no | yes | yes |
| S112 | docs-check: moved path reused | docs-check.mjs:2120-2123 | a file at a path the move map lists as moved | document form | K | no | yes | yes |
| S113 | docs-check: red tag without disposition | docs-check.mjs:2133-2136 | a planning pass's red tag older than one pass | document lifecycle | K | no | yes | yes |
| S114 | docs-check: decision `dispatch` line form | docs-check.mjs:2137-2144 | dispatch field lacks a control prefix or exceeds 240 chars | record form | K | no | yes | yes |
| S115 | docs-check: FOR-CORE entry fields (WO-276) | docs-check.mjs:2147-2149 (checks :1811-1900) | an instance's for-core file entry lacks date heading or fields | record form | K | no | yes | yes |
| S116 | docs-check: area-note block fields (WO-276) | docs-check.mjs:2150-2156 | an area note beside a profile lacks its block fields | record form | K | no | yes | yes |
| S117 | docs-check: pattern-reader screen (WO-276) | docs-check.mjs:2157-2163 (scripts/lib/markdown-screen.mjs) | a source reads Markdown/JSON with its own pattern | code form | K | no | yes | yes (whether it screens kit files inside an instance: unverified) |
| S118 | docs-check: operator-quote shape | docs-check.mjs:2189 | a changed decision quotes the operator without capture fields | record form | K | no | yes | yes |
| S119 | docs-check: round-findings shape (WO-276) | docs-check.mjs:2192 | a changed decision's findings block malformed | record form | K | no | yes | yes |
| S120 | docs-check: broken links/anchors | docs-check.mjs:2194-2213 (link rules :316-374) | missing file/anchor, escaping link, private anchor | document form | K | no | partial | yes |
| S121 | docs-check: absolute home or private temporary path | docs-check.mjs:2214-2236 | a new line holding a home/private temp path | private path leak | W | no | yes (placeholders) | yes |
| S122 | docs-check: front page | docs-check.mjs:2242-2244 | front-page amendment rules | document form | K | no | partial | yes |
| S123 | docs-check: attributed operator words without capture | docs-check.mjs:2258-2266 | a changed record attributes speech to the operator without capture citation | paraphrase rule | K | yes: features.verbatim-operator-words=true (advises instead) | yes | yes |
| S124 | docs-check: verbatim screen (shared runs with captures) | docs-check.mjs:2268-2276 | a changed file shares N consecutive words with an ignored capture | paraphrase rule | K | yes: features.verbatim-operator-words=true | yes | yes |
| S125 | terms (branch screen) | test-runner.mjs:771-778; scripts/terms.mjs:84-108 | a line the branch adds matches a refuse-mode private term | private terms | W | partial: list entry modes; absent list → advisory only | partial (names file:line, never the term) | yes |
| S126 | index (work-orders index --check) | test-runner.mjs:800-806; scripts/work-orders.mjs:294-296, :498-503, :1332-1334 | index stale; open order missing from sequence; bad review-ladder line | sequence bookkeeping | K | no | yes | yes |
| S127 | siblings index --check | test-runner.mjs:807-814 | registry differs from projection | sibling register | K | no | yes (`siblings index`) | yes |
| S128 | lineage index --check | test-runner.mjs:820-825 | lineage index stale | records | K | no | yes | yes |
| S129 | harness-context --check (unresolved Read selectors) | test-runner.mjs:960-966; scripts/harness-context.mjs:248-256 | a role skill/CLAUDE.md Read line names a missing file or section | instruction integrity | K | no | partial | yes |
| S130 | plan-refutation-current | test-runner.mjs:979-983 | current receipts fail their check | planning records | K | no | partial | yes |
| S131 | meta --check (decisions index, follow-ups, FEATURES.md) | test-runner.mjs:1026-1031; scripts/lib/meta.mjs:496 | decisions index / register / features page stale | generated records | K | no | yes (`npm run meta`) | yes |
| S132 | plan check: pass needs a receipt / receipt must match current subject | test-runner.mjs:1032-1036; scripts/lib/plan-receipts.mjs:2056-2071; scripts/lib/plan-continuation.mjs:30-35 | a planning pass without a refutation receipt, or an open order edited after its receipt without amend-order | planning review order | K | no | partial | yes |
| S133 | plan check: override/amendment bindings, private paths | plan-receipts.mjs:94-99, :1985-1989, :1991-2018 | amendment or override names a missing receipt/hold; private absolute path in a planning record | records / private path | K | no | partial | yes |
| S134 | reader-profiles check | test-runner.mjs:1037-1043 | reader choices/anchors/hashes disagree | records | K | no | partial | yes |
| S135 | entropy check | test-runner.mjs:1051-1055 | entropy receipts invalid | records | K | no | partial | yes |
| S136 | Suite row time limits (`timeoutMs`) | e.g. test-runner.mjs:555, :561, :564, :568, :572, :580 | a structural/document row slower than its limit | time bound | B | no | partial | yes |
| S137 | comment-labels | test-runner.mjs:786-793 | a new comment carries a report label or leading order id | comment form | K | no | yes | no (core-only) |
| S138 | git-surface | test-runner.mjs:574-578 | Git forms outside the recorded surface | Git floor | H | no | partial | no (core-only) |
| S139 | resume fixtures preflight; product-read guard | test-runner.mjs:647-654; scripts/lib/product-read-guard.mjs | core lifecycle fixtures; a product task reads admitted record paths | core evidence | K | no | partial | no (core-only; instance selections are document runs, test-runner.mjs:2647-2652) |

Checked and found **advisory, not a gate failure**: cold-start byte ceilings
and every other `budgets.json` limits verdict (`scripts/lib/process-budget.mjs:268-276`;
`scripts/harness-context.mjs:241` "budget observations never refuse";
`scripts/lib/meta.mjs:2395-2420`); long paragraphs (`docs-check.mjs:2164-2180`,
"judged by nothing"; off with budgets.json documents.paragraphWords=null);
effort below recommendation (`resume.mjs:860-868`); `readCapBytes` feeds the
read-your-own-output advisory (`harness-host.ts:4324-4332`).

## 5. Counts (rows S01-S139)

Counted mechanically from the table rows above by a script that parses each
`| S..` row (139 rows; a grouped row counts once).

| By class | Rows |
|---|---|
| W | 28 |
| K | 92 |
| H | 10 |
| B | 9 |

| Instance can turn off or down today | Rows |
|---|---|
| yes (15 by a key; 1 "down" by memory shares; 3 partial via the private terms list's modes or an empty list) | 19 |
| no | 119 |
| n/a (S60 accept-overrun, itself the route) | 1 |

Class x off: W 6 yes / 22 no; K 6 yes / 86 no (the six: S06, S50
plan-first; S69 auto-update-upstream; S70 kit.applyInstanceActions; S123,
S124 verbatim-operator-words); H 1 down / 9 no; B 6 yes / 2 no / 1 n/a.

| Ships to an instance | Rows |
|---|---|
| yes | 133 |
| no (core only: S73, S137, S138, S139) | 4 |
| emitted but not installed (S27) / partly unverified (S93) | 2 |

| Route in the message | Rows |
|---|---|
| a way forward (yes or partial), no override | 123 (S92 counted here: it names `operator override: off` to leave the mode) |
| a way forward and `operator override:` | 2 (S05, S07) |
| `operator override:` only | 1 (S09) |
| no route | 12 (S19, S23, S27, S28, S29, S30, S31, S33, S34, S35, S41, S62) |

Note: 9 of the 12 no-route stops are target-worktree (sibling repository)
denials or the main-worktree lookup; none of the sibling denials can be
suspended by `operator override:`.

## 6. Growth across the last 15 release tags (Part 2)

Commands (read-only): `git grep -h -o -E 'DOTLN_[A-Z0-9_]*REFUSED' <tag> -- scripts packages | sort -u` per tag; the "non-test" column adds the excludes
`':!scripts/test-*' ':!**/test/**' ':!**/fixtures/**' ':!**/*.md' ':!**/*.json'`.
Supporting columns: override-as-route = non-test lines matching
`Use operator override|use operator override: for authorized recovery|operator override:\` suspends`;
refusal-marker lines = non-test lines in scripts/ and packages/*/src matching
`refused:|refused before|_REFUSED|refuses:|refusal:`; throws = non-test
`throw new Error` lines there; gate rows / preflight rows from
`scripts/test-runner.mjs` at the tag; docs-check fails = `failures.push(`
sites in `scripts/docs-check.mjs`; hook denials = `protocolRefusal(`/`deny(`
call lines in `packages/skeleton/src/harness-host.ts`.

| Tag | Date | Codes (regex, all) | Codes (non-test) | Override-as-route lines | Refusal-marker lines | throw sites | Gate rows | Preflight rows | docs-check fail sites | Hook denial calls |
|---|---|---|---|---|---|---|---|---|---|---|
| v1.2.0 (WO-282) | 2026-11-16 | 16 | 14 | 5 | 244 | 2525 | 77 | 19 | 60 | 21 |
| v1.1.0 (WO-281) | 2026-11-16 | 16 | 14 | 5 | 244 | 2524 | 77 | 19 | 60 | 21 |
| v1.0.1 (WO-277) | 2026-11-15 | 16 | 14 | 5 | 244 | 2522 | 77 | 19 | 60 | 21 |
| v1.0.0 (WO-276) | 2026-11-14 | 16 | 14 | 5 | 244 | 2524 | 77 | 19 | 60 | 21 |
| v0.122.1 | 2026-11-09 | 16 | 14 | 5 | 229 | 2451 | 77 | 19 | 49 | 21 |
| v0.122.0 | 2026-11-08 | 16 | 14 | 5 | 229 | 2450 | 76 | 19 | 49 | 21 |
| v0.121.0 | 2026-11-08 | 16 | 14 | 5 | 229 | 2441 | 75 | 18 | 48 | 21 |
| v0.120.1 | 2026-11-07 | 16 | 14 | 5 | 226 | 2435 | 75 | 18 | 48 | 20 |
| v0.120.0 | 2026-11-07 | 16 | 14 | 5 | 226 | 2423 | 75 | 18 | 48 | 20 |
| v0.119.0 | 2026-11-06 | 15 | 13 | 5 | 218 | 2383 | 75 | 18 | 48 | 18 |
| v0.118.0 | 2026-11-05 | 15 | 13 | 5 | 217 | 2379 | 75 | 18 | 48 | 18 |
| v0.117.0 | 2026-11-05 | 15 | 13 | 5 | 207 | 2375 | 75 | 18 | 48 | 18 |
| v0.116.0 | 2026-11-04 | 15 | 13 | 4 | 203 | 2370 | 75 | 18 | 48 | 17 |
| v0.115.0 | 2026-11-04 | 15 | 13 | 4 | 203 | 2358 | 75 | 18 | 48 | 17 |
| v0.114.0 | 2026-11-03 | 15 | 13 | 4 | 203 | 2357 | 75 | 18 | 48 | 17 |
| (base v0.113.0) | 2026-11-03 | 15 | 13 | 4 | 203 | 2344 | 75 | 18 | 48 | 17 |

The only code change in the window: `DOTLN_PLAN_FIRST_REFUSED` first appears at
v0.120.0. `CLAUDE.md` says "9 refusals" from v0.117.0 (8 before); the ninth
is the gh-repository refusal (WO-246), which also added the fifth
override-as-route line. Codes are flat; growth is in un-coded checks
(throw sites +181, refusal-marker lines +41, docs-check fail sites +12,
hook denial calls +4 across the window).

Per order (code sets diffed between consecutive tags; non-code checks from
`git diff -U0 <a> <b> -- scripts packages` filtered to added/removed
`throw new Error|failures.push|refus|exitCode = 1` lines, excluding tests
and fixtures):

- **WO-276 (v0.122.1 -> v1.0.0)**: codes added none, removed none. New
  failing checks: docs-check FOR-CORE entry fields (S115), area-note block
  fields (S116), pattern-reader screen (S117), round-findings shape (S119)
  (`forCoreFailures`, `areaNoteFailures`, `markdownScreen`,
  `roundFindingFailures` absent at v0.122.1, present at v1.0.0;
  docs-check fail sites 49 -> 60); starter-update merge judgments (S71,
  "the update's merge" messages 0 -> 6, about 17 new throw sites in
  `scripts/launchpad.mjs`); `kit runtime differs from the manifest`
  (`launchpad.mjs:1633`); reserved extensions root (`launchpad.mjs:474`);
  release-close `--merged-as` validation (`scripts/lib/merged-change.mjs`,
  7 new throws); `work-order authority must open with its title heading`
  (`release.mjs:926`). Net +73 throw sites, +15 refusal-marker lines.
  Removed lines in the same diff were rewrites at the same sites (not
  individually verified).
- **WO-277 (v1.0.0 -> v1.0.1)**: codes none. Removed one stop: the 64 KB
  planning-cost-table refusal (`PLAN_COST_BYTES` in `scripts/lib/meta.mjs`
  and the 64 KB read check in `scripts/lib/plan-subject.mjs`), which had
  refused every planning pass. Added none. Net -2 throw sites.
- **WO-281 (v1.0.1 -> v1.1.0)**: codes none. Added: the export refuses a
  documentation map that links fewer READMEs than the seeded roots
  (`launchpad.mjs:1228`, core export path only); budgets validation
  `Invalid budget: documents.paragraphWords` (`scripts/lib/process-budget.mjs:68`).
  The new long-paragraph list is advisory and off with
  `documents.paragraphWords: null`. Net +2 throw sites.
- **WO-282 (v1.1.0 -> v1.2.0)**: codes none. Added: the starter update
  refuses while the clone has a grafts file (`launchpad.mjs:2617-2629`).
  Net +1 throw site. (Its follow-up change removes a hand-repair step; it
  adds no stop.)

Lines in scripts/ and packages/ that name `operator override` as the route
out of a refusal (non-test, at HEAD): **5** —
`packages/skeleton/src/harness-host.ts:2483` (gh-repository),
`:6055` (planning branch), `:6533` (outside write),
`packages/compiler/src/harness.ts:1820` (the shared nine-refusals text
emitted into every instance's CLAUDE.md: use operator override: for
authorized recovery), `packages/skeleton/src/loadouts/contributor.ts:107`
(role text: override suspends DotLn gates for authorized recovery).
All lines naming operator override in any form: 85 including tests and
fixtures, 26 non-test.

## 7. Recorded uses of `operator override:` since 2026-11-01 (Part 3)

Sources read: `docs/control/orders/*.jsonl` (the committed per-order
segments; `docs/control/resume.jsonl`, `plan-refutations.jsonl` and
`entropy-reducer.jsonl` hold no OperatorOverrideRecorded rows),
`docs/evidence/WO-27*/decisions.md`, `docs/evidence/WO-28*/decisions.md`,
tracked `docs/planning/passes/*2026-11-*.md` (the untracked 2026-11-16 pass
was not read).

1. **2026-11-01, 18:50:42Z to 18:51:31Z — WO-237, `resume: next`.**
   Record: `docs/control/orders/WO-237.jsonl` OperatorOverrideRecorded
   (bypassed dotln-hook-enforcement, effects unobserved);
   `docs/evidence/WO-237/decisions.md:392-408` (WO-237-D012). Used to stop
   the fourth complete gate run with `node scripts/harness.mjs evidence --stop`
   and have the order passed; nothing else was written under it, and the
   operator then asked for one full passing run. What held the person: a
   long complete gate run inside the dispatch (the 2026-11-01 pass counts 35
   interventions on WO-237, 2 of class override). Inference from code: the
   gate stop itself is admitted without an override (live-gate text,
   `harness-host.ts:5937`), so the override was not strictly needed for it.
2. **2026-11-15, 03:14:19Z to 03:19:36Z — planning pass
   `v1-0-0-instance-returns-and-followups-2026-11-14` (first session).**
   Record: the pass document only
   (`docs/planning/passes/v1-0-0-instance-returns-and-followups-2026-11-14.md:66-75`,
   `:760-800`). What refused: `npm run meta -- --plan-cost` refused the
   planning cost table at 67,334 bytes against a fixed 64 KB code limit, so
   the refutation receipt could not be filed; removing the limit needed edits
   to three code files, which the planning-branch write refusal (S09)
   blocks with override as its only route. Afterwards
   `npm run resume -- override-record` refused with "no main-branch
   control-plane worktree found" (S62) because the main checkout held the
   planning branch, so no OperatorOverrideRecorded row exists. The pass
   paraphrases the operator: the session was to finish without the
   operator's hands and without override as its route, and a limit should be
   raisable by editing a file. WO-277 then removed the limit.

Mentions that are not November uses: the 2026-11-03 pass
(`recurring-failures-and-queue-drain-2026-11-03.md:226`) counts one journal
row of an override entered 2026-10-22 still open; the 2026-11-08 pass
(`git-2-31-support-and-fork-returns-2026-11-08.md:490`, item 5) names
override as the route for a planned `git fetch --tags` refusal (a plan, not
a use). No override use is recorded in the decisions of WO-276, WO-277,
WO-281 or WO-282.

Related operator interventions to continue past a bound (accept-overrun,
`DispatchBoundAccepted` in `docs/control/orders/*.jsonl`) since
2026-11-01: 12 — WO-247 (11-01, wall clock 10 h), WO-249 (11-02, 16 h),
WO-257 (11-06, wall clock and complete runs unlimited), WO-276 (11-10 24 h
and cap 100; 11-11 48 h and cap 220; 11-11 72 h; 11-12 96 h; 11-14 cap 50),
WO-281 (11-15, cap 30).

## 8. Fifteen class-K stops most likely to stop a person in ordinary use

Ranking is an inference. Evidence used: the 2026-11-03 pass's fourteen-day
journal counts (`recurring-failures-and-queue-drain-2026-11-03.md:215-235`:
513 working-directory, 434 control-syntax and 336 substitution
classifications in this checkout; 511 / 320 / 201 in the operator's
instance; settings.user 27 / 101; remote.unapproved 18 / 42 — advisories in
the launchpad, denials in a target worktree); the two November override
uses (section 7); WO-277's decisions (an edit refused under a live sync
gate, `docs/evidence/WO-277/decisions.md:312`; sync checks refused on time,
`:939-969`).

1. S29 target "effect classification unavailable" — packages/skeleton/src/harness-host.ts:8913-8921
2. S31 target "shell requires worktree-root cwd" — harness-host.ts:8793-8798
3. S30 target "compiled authority does not permit" — harness-host.ts:8756-8762, :8864
4. S08 live-gate write refusal — harness-host.ts:6603-6721 (applied :6953-6959)
5. S09 planning-branch write refusal (override only) — harness-host.ts:6027-6057
6. S62 "no main-branch control-plane worktree found" — scripts/lib/git.mjs:327-333
7. S42 / S21 phase legality (lifecycle and phrase) — scripts/resume.mjs:1232-1237; harness-host.ts:1538-1540
8. S53 completion needs a passing product-gate row at the current code identity — scripts/lib/handoff-ledger.mjs:575-597
9. S54 completion needs a current passing document-gate row — handoff-ledger.mjs:456, :618
10. S51 handoff ledger must judge every criterion — handoff-ledger.mjs:331-356
11. S98 generated artifacts stale (structural "generated") — scripts/lib/generated-artifacts.mjs:31-80; scripts/structural-checks.mjs:178-196
12. S64 stale follow-up register refuses plan start and plan check — scripts/lib/planning-followups.mjs:664-670 (via scripts/refute-plan.mjs:439, :572)
13. S132 plan check: pass needs a receipt matching the current subject — scripts/lib/plan-continuation.mjs:30-35; scripts/lib/plan-receipts.mjs:2056-2071
14. S94 format preflight fails the whole gate — scripts/test-runner.mjs:547-554
15. S33 target "delegation or interaction has no bounded worker adapter" — harness-host.ts:8893-8899

Next in line: S44 attestation readback (`resume.mjs:827-851`), S97
declarations (`structural-checks.mjs:111-126`), S113 red tags
(`docs-check.mjs:2133-2136`), S126 work-order index/sequence
(`work-orders.mjs:294-296`).
