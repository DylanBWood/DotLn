# WO-157 decisions — Closeout follow-ups, one order

Dispatch: `resume: next` on 2026-09-22, Claude Code 2.1.280 executor, model
`claude-opus-5-5[1m]`, effort `xhigh` (the session exports `CLAUDE_EFFORT=xhigh`,
observed with `printenv`; the operator selected `ultracode` for this session,
which DotLn records as `xhigh` with mode `subagents`). Authority:
`docs/work-orders/WO-157-closeout-followups.md`.

## WO-157-D001

```json
{
  "id": "WO-157-D001",
  "kind": "experiment",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "Keep the current method: run a changed suite through the runner (`npm test -- --only <suite>`) or directly with `node --test` interchangeably, and narrow an iteration to one case with `--test-name-pattern`; bypassing the runner saves nothing material.",
  "question": "This order changes fifteen seams and reruns roughly a dozen suites many times. Does invoking a suite directly with `node --test` instead of through the runner's `--only` selection save enough wall-clock per iteration to change how the fixtures are driven?",
  "alternatives": [
    "Drive every iteration through `npm test -- --only <suite>` (runner build check, gate row, live-gate lock)",
    "Invoke the suite file directly with `node --test --test-reporter=tap` after one build",
    "Narrow development iterations to the one case being written with `--test-name-pattern`, keeping the suite-level runs for evidence"
  ],
  "observation": "Before any edit, on the activation checkpoint: `npm test -- --only worktree-integration` took 44.44 s real (build 0.54 s already fresh; suite 43.47 s; 2 fresh tasks); `node --test --test-reporter=tap scripts/test-worktree-integration.mjs` took 42.70 s real (6 tests, 6 pass); `node --test --test-name-pattern 'three required refusals' scripts/test-worktree-integration.mjs` took 8.58 s (1 test, 1 pass).",
  "budget": {
    "wallSeconds": 600
  },
  "execution": "run",
  "cost": {
    "wallSeconds": 140,
    "tokens": null,
    "commands": [
      "/usr/bin/time -p npm test -- --only worktree-integration",
      "/usr/bin/time -p node --test --test-reporter=tap scripts/test-worktree-integration.mjs",
      "/usr/bin/time -p node --test --test-reporter=tap --test-name-pattern 'three required refusals' scripts/test-worktree-integration.mjs"
    ],
    "source": "Shell wall clock: the first command started at 2026-09-22T22:50:34Z and the third finished at 22:52:23Z (109 s), plus about 30 s to record this entry. Token attribution per command is unavailable."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "npm test -- --only <suite>",
      "node --test --test-name-pattern <case> <suite file>"
    ],
    "summary": "The runner adds about 1.7 s (4 %) over the direct invocation of the same suite, so neither is preferred for cost. The saving that exists belongs to narrowing an iteration to one case (8.6 s against 42.7 s), which is ordinary development practice and not a change of method; the evidence runs stay suite-level."
  },
  "outcome": "kept-current",
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "scripts/test-runner.mjs line 1106: `--only <suite>` selection",
    "docs/evidence/WO-145/decisions.md: trial selection guidance for this support"
  ],
  "rejected": [
    {
      "option": "Drive every iteration directly and never through the runner",
      "reason": "A 1.7 s difference does not pay for losing the runner's build check and gate row on the runs that are evidence."
    }
  ],
  "reopenWhen": "The runner's per-suite overhead exceeds about 10 % of a suite's own time, or a suite's single-case run stops being isolatable by name."
}
```

## WO-157-D002

```json
{
  "id": "WO-157-D002",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 item 1 (WO-100 D017), criterion 1",
  "decision": "Take the default route: `worktree integrate` refuses intent-to-add entries before it fetches, checkpoints or writes a receipt, naming every path and the remedy `git add -- <paths>`. Independently, a stash push that fails with nothing stashed removes the pending receipt (or restores the completed receipt it replaced) and rethrows Git's error; a stash created before a failure is recorded in the receipt instead. The receipt is still saved before the stash, not after it, and the dirty-tree read now precedes that save so nothing but the stash push sits between the receipt and the stash. Deviation from the item text, as bounded adjacent repair: the same refusal runs at the start of `--continue`, because `git stash apply` meets the same entry and would otherwise strand the helper at stage `applying`. After the WO-157 review: the stash and merge step is shared by a fresh run and a `--continue` from stage `preserved`, so a stash Git stores and then fails to finish is recoverable — the receipt records it, and `--continue` merges once the tree is clean (or `git stash apply <sha>` and removing the receipt starts again); and only a new stash entry carrying this integration's name and base commit counts as its own, because the stash stack is shared by every worktree.",
  "evidence": [
    "Reproduced 2026-09-22 on Git 2.55.0 in the session scratch: after `git add -N`, `git stash push --include-untracked` printed \"error: Entry 'a b.md' not uptodate. Cannot merge.\" and exited 1 with an empty stash list; `git status --porcelain=v2` reports both intent-to-add entries as `1 .A N...`, and `git diff --cached` omits them unless `--ita-visible-in-index` is passed",
    "Detection reads `git --no-optional-locks status --porcelain=v2 -z --no-renames --untracked-files=no` and keeps ordinary (`1`) rows whose worktree column is `A`, which only intent-to-add produces; `--no-renames` stops Git from reporting an intent-to-add file as a worktree rename of a deleted one, the path is the remainder after the eighth field, so paths with spaces survive (the fixture uses one), and `--no-optional-locks` keeps the refusal path from refreshing a stale index (the independent read-only analysis observed plain `git status` rewrite one: index 5bc06d53 to 0a2c399d)",
    "The same analysis observed in a scratch clone that `git stash apply` with an intent-to-add entry present fails after restoring part of the stash, which is what the `--continue` refusal prevents",
    "Probe 2026-09-22: with the worktree's `index.lock` held, `git status` still succeeds and `git stash push --include-untracked` fails with \"could not write index\" and creates no stash, which gives the fixture a second, non-intent-to-add stash failure after the checkpoint",
    "scripts/lib/worktree-integration.mjs integrateWorktree: the refusal sits after the existing-merge refusal and before `ls-remote`, `fetch`, `createCheckpoint` and the first `save()`",
    "Fail before: docs/evidence/WO-157/fixtures/item-01-before.tap — the new case fails its first refusal assertion because the current helper surfaces Git's stash error instead (`/intent-to-add/` does not match). Pass after: docs/evidence/WO-157/fixtures/item-01-after.tap — `node --test scripts/test-worktree-integration.mjs`, 7 of 7",
    "The same case then holds `index.lock` so the stash push fails after the checkpoint, and asserts that no receipt remains, the stash list is empty, HEAD and `git ls-files --stage` are unchanged, and a fresh run proceeds to the fixture's authored conflict with the newly staged file intact",
    "WO-157 review (items 1-2) reproduced, with a read-only directory blocking Git's cleanup, a stash stored and then failed that left the receipt at `preserved` where neither a fresh run nor `--continue` could proceed, and a concurrent stash from another worktree being recorded as this integration's; both are fixed, with fixtures: 'a stash Git stores and then fails to finish resumes with --continue; --continue refuses intent-to-add entries' and 'a later stash failure with nothing stashed restores the completed receipt it replaced' (scripts/test-worktree-integration.mjs 9 of 9)"
  ],
  "rejected": [
    {
      "option": "Stage intent-to-add entries automatically and record `stagedIntentToAdd` in the receipt (the admitted alternative)",
      "reason": "It changes the index behind the actor's back. An executor marks a file with `-N` on purpose, and the remedy is one command the refusal prints; refusing keeps the index the actor's."
    },
    {
      "option": "Save the receipt only after the stash push succeeds",
      "reason": "It opens a crash window. A process killed after the stash but before the save leaves a clean tree, a named stash and no receipt, so a fresh run would merge and complete without restoring the work. Saving first and removing the receipt only when nothing was stashed keeps every crash point recoverable."
    },
    {
      "option": "Remove the receipt on every stash failure",
      "reason": "When Git created the stash commit and then failed, the work has moved into the stash, and the receipt must keep naming it."
    }
  ],
  "unblocks": "Every final review's integration (product 07 §Independent workflows and integration): an executor's `git add -N` no longer strands the reviewer behind an operator-authorized recovery.",
  "goalAlignment": "Mission: move recurring recovery into machinery. Shifting the burden: WO-100's reviewer needed an operator authorization to recover; the refusal now costs one printed command. Fixes that fail: the refusal comes before any write, so it cannot itself leave state. Rule beating: the fixture asserts the unchanged index bytes, refs, stash list and receipt absence, not only an exit code. NoOp keeps a documented manual workaround in product 07 that every reviewer must remember.",
  "reopenWhen": "An integration receipt is again left at stage `preserved` with no stash, or Git reports intent-to-add entries in a form this reader misses (for example a porcelain v2 change)."
}
```

## WO-157-D003

```json
{
  "id": "WO-157-D003",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 item 2 (WO-064 D011, WO-152 D011), criterion 2",
  "decision": "Add a `retarget` queue action that changes only a deferred item's target to a `FUP-` identifier. It is admitted in the final-review phase as well as `active` and `repairing`, and a `reviewer` actor may record it (only it). The CLI checks the identifier against the synced follow-up register with the same current-destination rule the handoff check uses, now shared as `currentFollowupTarget`. Add the sync-before-dispose sentence to the executor's Follow-up Queue support.",
  "evidence": [
    "scripts/adjacent-work.mjs main() admitted `apply --file` only in `active` and `repairing`; the fold (scripts/lib/adjacent-queue.mjs) admitted only `executor` and `operator` actors, so the retarget WO-064 D011 and WO-152 D011 asked of a later actor could not be expressed",
    "scripts/lib/planning-followups.mjs requirePlanningHandoffs is the check that raises the advisory; its destination rule (present, not missing, not settled or declined, duplicates followed) moved unchanged into the exported `currentFollowupTarget` so the retarget admits exactly what the handoff will later accept",
    "The fold checks only the identifier's shape, never the register: a historical queue event must keep folding after the register changes (the same lesson as item 14); the register check runs once, when the CLI applies the command",
    "Fail before: docs/evidence/WO-157/fixtures/item-02-before.tap — the first retarget in the final-review phase is refused with 'mutation requires the selected executor/fixer phase' where the case expects the FUP-shape refusal. Pass after: docs/evidence/WO-157/fixtures/item-02-after.tap — scripts/test-adjacent-queue.mjs 6 of 6; the case covers prose, a missing FUP, an extra field, a queued item, a queue and a dispose attempted in final review, and a byte-unchanged queue before the successful retarget",
    "`node --test --test-name-pattern 'follow-up handoffs' scripts/test-process-debt.mjs` still passes after the refactor",
    "Discoverability without role text: the handoff advisory a reviewer meets now names the fix ('link it (a retarget action, also at final review)'); the executor sentence carries the rest. A malformed request in a non-admitted phase still reports the phase refusal first, as before",
    "Identifier shape admits both register forms, `FUP-` plus 16 hex digits and the migration rows `FUP-NNNN` (the analysis counted 133 legacy rows), so a legacy target is never refused by shape",
    "`git worktree list` on 2026-09-22 shows only main and wo-157, and neither holds a WO-064 or WO-152 queue: the queue is ignored per-worktree state, so the two retained literal targets are no longer reachable and stay as recorded, as the map's 2026-09-22 closes section says",
    "WO-157 review (items 1-2): the reviewer-actor rule was exercised only behind the CLI's phase gate; a fold-level case now proves a reviewer actor is refused for queue and dispose and admitted for retarget (scripts/test-adjacent-queue.mjs 7 of 7)"
  ],
  "rejected": [
    {
      "option": "Allow the whole command set in final review",
      "reason": "A reviewer must not queue, start or dispose repairs; only the missing link is reviewer bookkeeping."
    },
    {
      "option": "Validate the FUP identifier inside the fold",
      "reason": "It would make an old queue unfoldable when a follow-up is later settled or declined."
    },
    {
      "option": "Only add the sync-before-dispose sentence",
      "reason": "A deferral recorded before the decision is synced (the recurring case) would still have no correction path at final review."
    }
  ],
  "unblocks": "Every final review: the carried adjacent-queue advisory can be closed by the reviewer instead of travelling on ImplementationReady and RepairCompleted.",
  "goalAlignment": "Escalation: one action kind, one phase widening scoped to it and one role sentence; no new gate. Tragedy of the commons: the sentence adds about 250 bytes to the executor's cold-start text, measured against its ceiling at the bundle regeneration. Rule beating: a retarget must name a current register row, so prose cannot pass. NoOp repeats the advisory on every order that defers before syncing.",
  "reopenWhen": "A third order's queue carries a literal target after WO-157 closes, or the handoff's target check becomes blocking."
}
```

## WO-157-D004

```json
{
  "id": "WO-157-D004",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 item 3 (WO-100 D016), criterion 3",
  "decision": "Count and classify the committed change inside the generic source-change host (WO-052). After the surface check, `SourceChangeWorktree.effect()` reads `git diff --no-renames --name-status <base> <commit>` and refuses when the path count exceeds the envelope's `resourceLimits.files` (only when the envelope carries one), and refuses any `D` or `T` entry unless the envelope allows `repo.delete`, except a `D` of the declared Sort relocation's source. The portfolio host passes a Sort order's relocation to the source-change host. The refusals name the paths and the ceiling. The `PortfolioCeiling.files` comment now says what is enforced. After the WO-157 review, the limits are applied once, when a change is first observed (`effect(true)` in the host's observe step), so a receipt saved before WO-157 still finishes and recovers; the host's own Git calls in the worktree run with hooks and fsmonitor off (D005).",
  "evidence": [
    "packages/skeleton/src/source-change-worktree.ts effect(): the surface check used `--name-only` with no count and no status filter, so a file turned into a directory of files inside the surface passed (WO-100 D016)",
    "packages/skeleton/src/portfolio.ts portfolioEnvelope carries the phase ceiling as `resourceLimits.files`, so the host can read the ceiling from the authority envelope it already receives; non-portfolio orders carry none and are not counted",
    "packages/skeleton/src/worker-protocol.ts validateWriterRequest admits only repo.write, git.local and shell.run in a writer envelope, so no source-change writer can carry repo.delete: under this rule every removal or type change is refused except the declared Sort move, which the portfolio host then checks exactly (relocationHolds). Observed: a fixture envelope that added repo.delete was refused at admission with profile-refused 'source-change request or environment'",
    "With renames off, a Sort move reads as `D <from>` and `A <to>`, and a file replaced by a directory reads as `D <file>` plus `A <file>/<child>` rows",
    "Fail before: docs/evidence/WO-157/fixtures (the item 3 case is in packages/skeleton/test/source-change-host.test.ts and is re-run against the base source in the fail-before sweep, D018): the directory replacement is observed, not refused. Pass after: the case refuses the directory replacement ('removes or changes the type of paths without repo.delete: D fixture.txt') and the two-path change over a ceiling of 1 ('touches 2 paths, above the envelope's files ceiling of 1: fixture-extra.txt, fixture.txt'), and observes the in-ceiling change and the declared Sort move; the Sort move without its declared relocation is refused",
    "packages/skeleton/fixtures/writer-cli.mjs gains commit-move, commit-directory and commit-wide behaviours; the existing behaviours are unchanged; source-change-host and portfolio unit suites pass (20 of 20 after the change)",
    "WO-157 review (items 3-5): re-checking the limits in finish() and saved-receipt recovery would strand a pre-WO-157 store holding a removal; admission is now scoped to observation. Pass after: docs/evidence/WO-157/fixtures/item-03-after.tap (source-change-host, portfolio and writer unit suites, 30 of 30); fail before: fixtures/fail-before-sweep.txt, item 3 ('observed' where 'thrown' is expected)"
  ],
  "rejected": [
    {
      "option": "Put the check only in the portfolio host, before WO-054",
      "reason": "The item names the source-change host, and a removal is the repo.delete effect for every writer, not only a derived one. The generic host already refuses out-of-surface paths in the same place."
    },
    {
      "option": "Admit removals for non-portfolio orders",
      "reason": "It would keep the WO-052 hole the order closes: a writer granted only repo.write could delete. A target or repair order that must remove a path needs repo.delete admitted in the writer envelope, which is an authority decision for the operator, not a side effect of this order."
    }
  ],
  "unblocks": "WO-111 and the first unattended portfolio on an operator repository (WO-118's starter instance): a derived order can no longer exceed its declared size or remove paths it was not granted.",
  "goalAlignment": "Rule beating is the trap: a writer could satisfy every surface prefix while replacing a file with any number of files. Fixes that fail: the Sort move is exempted only for its exact declared source, so the guard does not undo the relocation contract. Naive Interventionism: every current WO-052 consumer was checked (fixture target orders commit one file; portfolio Sort orders pass their relocation). NoOp leaves the comment claiming a host count that does not exist.",
  "reopenWhen": "A verifier shows a derived order's change exceeding its declared size after WO-157 closes, or a target or repair order legitimately needs to remove a path (the writer envelope must then admit repo.delete by an operator decision)."
}
```

## WO-157-D005

```json
{
  "id": "WO-157-D005",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 item 4 (WO-064 D010), criterion 4; the WO-157 review's findings on item 4",
  "decision": "Probe both writer profiles, then land a guard wider than hooks. Target publication pushes the observed commit from a host-created bare repository: it fetches the writer's branch from the target, verifies the observed commit, and pushes it to origin's configured push URL with hooks and fsmonitor off. Neither the target's hooks nor its repository configuration (core.sshCommand, include.path, remote.<name>.receivepack, credential helpers, URL rewrites) runs in the operator's publish process; only the operator's global and system configuration apply. The push URL is origin's configured URL before any rewrite, and it must name the same GitHub repository ensureGh resolved. Every other host Git call in publication, and in the source-change worktree, runs with `core.hooksPath=/dev/null` and `core.fsmonitor=false`.",
  "evidence": [
    "scripts/lib/target-publish.mjs pushed from the target's Git root with no hook override, the first host-privileged remote call after a writer ran in a linked worktree of that repository (WO-064 D010)",
    "Probe (docs/evidence/WO-157/writer-profile-probe.md): the Codex `dotln-writer` sandbox profile refused writes to <common>/hooks/pre-push, config and a new file (`codex sandbox`, no model; stricter than a live writer because Git's own ~/.gitconfig read was refused too), and the Claude target bundle's permissions hook denied the same writes while admitting an in-worktree write. Neither profile is disproved, because code the writer controls reaches the common directory through the test command: a worktree test script run the way runFocusedTest runs it wrote <common>/hooks/pre-push and a receivepack line into <common>/config",
    "The WO-157 review reproduced, against the hooks-disabled push alone, code execution from the target's repository configuration: core.sshCommand (with an ssh pushurl), include.path to a writer-controlled file, and remote.origin.receivepack (with the fixture's local origin). Pushing from a fresh bare repository never reads that configuration",
    "The review also reproduced a planted post-checkout hook running on the source-change host's own `git worktree add`, and a planted core.fsmonitor running on its `git status`; both are now off in the host's Git calls",
    "Fail before: docs/evidence/WO-157/fixtures/item-04-before.tap — planted pre-push and reference-transaction hooks ran during publication. Pass after: docs/evidence/WO-157/fixtures/item-04-after.tap — scripts/test-target-publish.mjs 6 of 6; the case plants the two hooks (shown to run on an ordinary push), a remote.origin.receivepack, a core.sshCommand and an include.path whose file sets core.fsmonitor, and none runs during publication while the remote branch receives the commit",
    "Fixture change: the scenario's publish process now carries the local-origin rewrite in a fixture global configuration (GIT_CONFIG_GLOBAL), because publication no longer reads the target's repository-level rewrite"
  ],
  "rejected": [
    {
      "option": "Disable hooks on the target push only (the item's example)",
      "reason": "The review reproduced three configuration paths that still run code in the operator's publish process; the item's snapshot alternative names 'other hook-relevant configuration'."
    },
    {
      "option": "The snapshot route (refuse when hooks or configuration changed since before the writer ran)",
      "reason": "It needs a pre-writer snapshot persisted by the source-change host in its store (a new record and decoder), and it would still run an operator-set hook or helper; pushing from a fresh repository removes the whole class with no new state."
    },
    {
      "option": "Push to the URL `git remote get-url` reports",
      "reason": "It applies the target's URL rewrites, which a writer can plant; the configured URL checked against the resolved repository cannot be redirected."
    }
  ],
  "compatibility": "A target whose push relies on repository-level configuration — a repository-scoped credential helper or URL rewrite, or an operator's pre-push check such as a Git LFS upload — no longer gets it during DotLn publication; the operator's global and system configuration still apply.",
  "knownLimit": "The source-change host runs the order's test command, whose files the writer may edit, with the operator's privileges and no OS sandbox (product 03: 'not OS isolation of arbitrary test scripts'). That predates WO-157 and is wider than publication: such code can read the operator's credentials before any push.",
  "followup": "Before the first target publication of a model-written episode (WO-066): run the source-change host's focused test run, and the Claude writer's admitted test command, under an OS sandbox with no network and writes confined to the worktree, so writer-controlled test code cannot reach the target's common Git directory or the operator's credentials; add a fixture whose test script attempts both.",
  "unblocks": "WO-066, the first sequenced order that pushes a worker's repaired head under the grant, then WO-112 and WO-118.",
  "goalAlignment": "Mission: the first remote effect under compiled authority stays bounded to the effect the grant names. Rule beating: every refusal preceding the push is ordering, not containment. Naive Interventionism: a target's legitimate repository-level push configuration no longer applies during publication, recorded as the compatibility impact. NoOp would leave three reproduced code-execution paths in the operator's process.",
  "reopenWhen": "A target's operator requires a repository-level hook, helper or rewrite during publication, a live writer probe contradicts the recorded probe, or the focused test run is sandboxed (then re-judge the guard's scope)."
}
```

## WO-157-D006

```json
{
  "id": "WO-157-D006",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 item 5 (WO-064 D006), criterion 5",
  "decision": "Admit the optional host-owned `authorityGrantRegistry` in the skeleton's `isCompilationEnvironment`, validated with the compiler's `normalizeAuthorityGrants`; the five required keys stay exact. State the optional field in product 02 §Artifact identity v1.",
  "evidence": [
    "packages/skeleton/src/artifact-identity.ts isCompilationEnvironment required exactly five keys, so `compileArtifact` refused every environment the compiler admitted with a registry and `LiveReactorDriver.equip` recorded ArtifactCompilationRefused (WO-064 D006)",
    "packages/compiler/src/types.ts CompilationEnvironment declares `authorityGrantRegistry?: readonly AuthorityGrant[]` as host-owned input; packages/compiler/src/authority.ts normalizes it with normalizeAuthorityGrants before admitting graph grants",
    "Fail before: docs/evidence/WO-157/fixtures/item-05-before.tap — the equip of a grant-bearing Seiri graph records ['ArtifactCompilationRefused'] where the case expects none. Pass after: docs/evidence/WO-157/fixtures/item-05-after.tap — the identity equips, carries the registry, runs a full SourceChangeHost episode to `observed` (one launch), a registry with an unadmitted grantedBy refuses at equip, a version-0 grant fails isArtifactIdentityV1, and a non-array registry makes the SourceChangeHost constructor throw 'compiled artifact identity is invalid'; source-change-host and artifact-identity suites 30 of 30"
  ],
  "rejected": [
    {
      "option": "Strip the registry from the identity in the compiler",
      "reason": "WO-064 D006 recorded it: equip recompiles from the identity's environment, so a grant-bearing loadout would then fail recompilation as unadmitted."
    },
    {
      "option": "Admit any value under the key",
      "reason": "The identity is a durable pin; a malformed registry must still refuse, and the compiler's own normalizer is the definition of well-formed."
    }
  ],
  "unblocks": "Any production dispatch of a grant-bearing loadout (WO-072, the resident, and target publication's writer if it ever carries publication grants).",
  "goalAlignment": "Policy resistance: the skeleton refused what the compiler admitted, so the two halves undid each other; one validator now defines both. Escalation: no new field or event. NoOp keeps WO-064's workaround of compiling writers without grants.",
  "reopenWhen": "A resident receipt records ArtifactCompilationRefused for a grant-bearing identity after WO-157 closes."
}
```

## WO-157-D007

```json
{
  "id": "WO-157-D007",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 item 6 (WO-100 D006), criterion 6; receipt 027 known issue on an unreadable profile",
  "decision": "Give `resident-bind` a portfolio form, `--portfolio <id> --template <resident.json> --base <40-hex commit>`, that takes the portfolio from the loaded `portfolios` entry and compiles the template's graph and environment through the same `registeredRepositoryInputs` path WO-071's `compileRegisteredRepositoryLoadout` uses (now extracted). `--check <store>` refuses a portfolio store whose definition differs from the loaded entry, whose compiled floor departs from the bound repository's registered `authorityProfile` (each departure named: environment.repo, a profile denial not denied or allowed, a resource limit exceeded, expiry, required evidence, revocations, and a grant neither the launchpad registry nor the exact profile grant provides), or whose profile cannot be read. The rule also applies when a mission-shaped binding record's resident.json carries a portfolio. No runtime source changes.",
  "evidence": [
    "scripts/lib/config.mjs checks a portfolio ceiling against its repository's profile only when the loader reads dotln.config.json; decodeResidentConfiguration (resident-state.ts) compiles whatever graph and environment resident.json carries, so a hand-written store bypassed the profile (WO-100 D006). The read-only analysis reproduced it in scratch: a hand-widened store with repo.delete allowed and a 16-file limit decoded while the profile limits files to 8",
    "scripts/lib/authority-grants.mjs compileRegisteredRepositoryLoadout had no production caller; its inputs step is now `registeredRepositoryInputs`, and the compile is unchanged (scripts/test-authority-grants.mjs 4 of 4)",
    "Known issue (receipt 027): when no registered authorityProfile is readable — dotln.config.json invalid or absent, the repository not registered, or the portfolio binding `self` — `--check` refuses with a named reason distinct from a profile mismatch and prints no launch line. Passing would re-admit the defect; a `self` portfolio has no profile to compile under, so binding it is refused too, a narrowing of what the loader admits",
    "Fail before: docs/evidence/WO-157/fixtures/item-06-07-before.tap — the hand-written store's --check prints nothing where the case expects the named profile mismatch (the current source crashes on `binding.declaredSurfaces`), and `--portfolio` is an unknown option. Pass after: docs/evidence/WO-157/fixtures/item-06-07-after.tap — scripts/test-resident-bind.mjs 19 of 19; a loader-built store compiles to floor `fixture.portfolio.base+registered:scratch:fixture.scratch` and passes --check with launch lines; the widened store, a drifted definition, an invalid config, an absent config and a self portfolio each refuse by name with no launch line",
    "Registered sources: none of scripts/resident-bind.mjs, scripts/lib/authority-grants.mjs or the tests is registered in scripts/lib/evidence-sources.mjs, so this item re-mints nothing",
    "WO-157 review (items 6-7), all fixed with fixtures (scripts/test-resident-bind.mjs 21 of 21): grants are compared as the compiler admits them (reason ignored), so a loader-built store whose template grant differs only in reason passes its own --check; the WorkOrder's operations are checked against the profile's denials as the envelope's effects are; `bindPortfolio` refuses a template that would not pass --check; the launch line's policy comes from the decoded store (a record naming another policy is a mismatch) and any non-identifier value is quoted; own-key lookups name a repository called 'constructor' as unregistered instead of crashing"
  ],
  "rejected": [
    {
      "option": "Enforce the profile inside the resident runtime",
      "reason": "WO-100 D006 recorded why: the skeleton cannot read launchpad configuration. The bind and its check are where the launchpad is known."
    },
    {
      "option": "Record the template in binding.json and recompute it exactly at --check (the analysis's admitted alternative)",
      "reason": "It names mismatches only coarsely and cannot judge a store written wholly by hand; the property check names each violated constraint."
    }
  ],
  "unblocks": "WO-111, whose criterion 6 forbids runtime changes: its production binding now has a path that compiles under the registered profile.",
  "goalAlignment": "Rule beating: the loader's check could be satisfied while the store that runs was written by hand; --check now judges the store. Shifting the burden: the operator no longer has to hand-verify a store. Escalation: one CLI form and one check, no runtime change.",
  "reopenWhen": "A portfolio binding is created outside `resident-bind`, the runtime gains a launchpad-profile input, an operator needs a portfolio over the launchpad itself (`self`), or applyRegisteredRepositoryProfile's rules change."
}
```

## WO-157-D008

```json
{
  "id": "WO-157-D008",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 item 7 (WO-100 D007), criterion 7; receipt 027 known issue on the resolved model id",
  "decision": "Make `--model` and `--effort` optional in `resident-bind`. The defaults per transport are `gpt-6-luna` for `codex-cli-exec` and `claude-sonnet-5` for `claude-cli-print`, both at `xhigh`, in an exported `DEFAULT_JUDGE` table resolved in `bindOrder` (so library callers get them too). binding.json records `modelSource` and `effortSource`, each `default` or `operator`. An unknown transport still refuses first. A rebind line omits a default-sourced flag, so a later default change is not recorded as the operator's choice. Product 06's paragraph moves from candidate to shipped.",
  "evidence": [
    "scripts/resident-bind.mjs refused a bind without both flags ('--model is required'); product 06 recorded the operator's candidate values and assigned adoption to WO-111, whose non-goals forbid runtime changes",
    "Model ids recorded as the CLI reports them, not an alias: docs/discovery/environment.json records that `--model sonnet` produced result-envelope model `claude-sonnet-5`, and WO-100's feedback edition records `claude-sonnet-5` on Claude Code 2.1.280; no Sonnet 5.5 is available (operator direction recorded in WO-100 D007)",
    "gpt-6-luna, observed 2026-09-22: `codex --version` is codex-cli 0.155.1 and the operator's Codex configuration names gpt-6-luna (key presence only; contents not copied); the local models cache (fetched by client 0.154.0) lists gpt-5.6-luna but not gpt-6-luna. The read-only analysis observed a 0.155.1 session recording model gpt-6-luna. The bound id is the operator's directive; the live readback below settles the cache discrepancy for this CLI version",
    "binding.json is read only by resident-bind.mjs (git grep); readBinding checks only the schema version, so the two new fields need no decoder change and retained stores still check (their judge line reads 'source not recorded')",
    "Fail before: docs/evidence/WO-157/fixtures/item-06-07-before.tap — '--model is required' where the case expects a default bind, and binding.modelSource undefined where it expects 'operator'. Pass after: docs/evidence/WO-157/fixtures/item-06-07-after.tap. Changed existing expectation (criterion 17): the argument-parsing case that expected '--model is required' now expects the flag absent in the parse result",
    "WO-157 review (items 6-7): an explicitly blank --model or --effort is refused ('needs a value; omit it to take the transport default') rather than recorded as an operator choice; the parse table covers it",
    "Live readback 2026-09-22, one minimal call each, as the WO-157 review asked: `claude -p --model claude-sonnet-5` on Claude Code 2.1.280 reported its usage under model id `claude-sonnet-5` (the call exceeded its USD 0.05 cap and ended error_max_budget_usd at USD 0.139, recorded as the cost of the check); `codex exec --ephemeral --ignore-user-config --model gpt-6-luna` at low effort on codex-cli 0.155.1 completed its turn (exit 0, reply 'OK'), so the CLI accepted the id, though its event stream does not echo the model"
  ],
  "rejected": [
    {
      "option": "Record modelSource inside resident.json",
      "reason": "The actor and mission-check request validators are strict and registered sources; the binding record is where the provenance of a bind already lives."
    },
    {
      "option": "One modelSource for both flags",
      "reason": "A bind may name only one flag; separate sources keep each value honest."
    },
    {
      "option": "Give in-process portfolio hosts the default",
      "reason": "They are bound by their caller in process (portfolio-host.ts is a registered source); product 06 says so, and a later host binding can import DEFAULT_JUDGE."
    }
  ],
  "unblocks": "WO-111: its unattended hour can bind always-on agents without flags that only restate the operator's standing default.",
  "goalAlignment": "Seeking the wrong goal would be recording an alias ('sonnet'), which moves silently; the table names ids. Drift to low performance: the rebind line keeps defaults defaults. NoOp keeps a refusal that asks the operator for a value they already decided.",
  "reopenWhen": "Claude Sonnet 5.5 becomes available (the Claude default moves to it), a default model is withdrawn or refused by its CLI, or the operator changes a role default."
}
```

## WO-157-D009

```json
{
  "id": "WO-157-D009",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 item 8 (WO-152 D009), criterion 8; receipt 027 known issue on an untyped detail",
  "decision": "Carry an `invalid-result` refusal's typed detail through the verification host and the `dotln` CLI line. `verification-protocol.ts` exports the closed vocabulary: the nineteen evidence-result contract reasons (the `check` helper now accepts only these, so a new reason fails to compile until it is listed), the transport parse phases `wire-json`, `final-message-absent` and `final-message-json`, and `unclassified`. The host records `WorkerInterrupted {commandId, workerEpisodeId, reason, detail}` for `invalid-result` only and rethrows `WorkerFailure(code, detail)`; the CLI prints `worker refused: invalid-result (<detail>); pending work is retained`. A detail outside the vocabulary is refused verbatim and recorded and printed as `unclassified`: the refusal event itself is always written. After the WO-157 review, the host's own receipt check (a transport receipt naming another command) raises `receipt-command`, added to the vocabulary, so no reachable refusal records `unclassified`.",
  "evidence": [
    "packages/skeleton/src/verification-host.ts recorded `reason: code` and rethrew `new WorkerFailure(code)`, dropping the detail the transport raised; packages/skeleton/src/dotln.ts printed only the code (WO-152 D009: two refused live episodes, USD 2.72, no cause)",
    "packages/skeleton/src/worker-host.ts already records a detail beside the code; the verification host now follows it, filtered through the vocabulary",
    "Reconciling the order's 'an unknown detail string is refused by the recorder' with receipt 027's 'never refused into silence': the unknown string is what is refused (never stored or printed), not the refusal record. Refusing the record would leave WorkerAttemptStarted without a terminal event, the undiagnosable state D009 recorded",
    "Other codes keep no detail: profile-refused details can carry free-text messages and transport-failed details for plan requests carry a stderr tail, so only the closed invalid-result vocabulary crosses into the store and the terminal",
    "Fail before: docs/evidence/WO-157/fixtures/item-08-before.tap — both CLI transports' forged-pass refusal rethrows with detail undefined, the leaky double's refusal has no recorded detail, and the CLI prints 'worker refused: invalid-result; pending work is retained'. Pass after: docs/evidence/WO-157/fixtures/item-08-after.tap — verification.test.js 21 of 21; the payload keys are exactly commandId, detail, reason and workerEpisodeId (no raw output) and the store holds no fragment of the leaky double's text",
    "Registered sources edited: verification-protocol.ts (all five inventories) and verification-host.ts (verification, feedback); dotln.ts is in no inventory (see D019)",
    "WO-157 review (items 8-11) enumerated every reason reachable into the verification host and found only the receipt-command raise without a term; fixture 'the host's own receipt check records its typed detail' (verification.test.js 22 of 22)"
  ],
  "rejected": [
    {
      "option": "Record the detail verbatim, as worker-host.ts does",
      "reason": "A future raise site could pass model text; the closed vocabulary is what keeps raw output out of the store and the terminal."
    },
    {
      "option": "Refuse to record a refusal whose detail is unknown",
      "reason": "It returns the episode to the undiagnosable class the item removes (receipt 027)."
    }
  ],
  "unblocks": "Every paid live verifier episode, first the one this order's re-mint runs: a refusal now says which contract rule the model's result broke.",
  "goalAlignment": "Tragedy of the commons: each blind retry of a refused episode cost about USD 1.36; the detail makes the retry decision informed. Rule beating: the fixture asserts the stored payload keys and the absence of the leaked text, not only the CLI string.",
  "reopenWhen": "A refused live episode is recorded with detail `unclassified` (a reachable reason is missing from the vocabulary), or a refused live episode has no diagnosable cause after WO-157 closes."
}
```

## WO-157-D010

```json
{
  "id": "WO-157-D010",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 item 9 (WO-151 D020), criterion 9",
  "decision": "Take the widen route. The Entropy Reducer host records, for dispatches made from now on, the source repository's untracked, non-ignored path listing (count and SHA-256 of the sorted paths, never the names) at dispatch and at filing, and the frozen copy's inventory delta as `added`, `removed` and `resized` path sets. The listing is an observation only: it is never part of the subject hash and never a refusal condition, because the dispatching session writes untracked evidence during an episode. Receipts that carry the new observation render a witness sentence that names only what is observed ('tracked-path status', 'untracked, non-ignored path listing', 'path-and-size inventory', and that ignored paths and file contents are not observed); earlier receipts and a dispatch pending from before the change keep their exact shape and rendering (WO-151 D016's conditional-rendering rule). After the WO-157 review, each path set is listed up to 100 entries and bound whole by its count and the SHA-256 of its sorted paths, because a worker names the paths and a build adds hundreds (REVIEW-002 and REFUTATION-003 each gained about 840 build files).",
  "evidence": [
    "scripts/lib/entropy-review.mjs: trackedStatus ran `git status --untracked-files=no` and scratchDelta.deltaCount was Math.abs(after.count - before.count), so a frozen copy that gained one path and lost another read as zero while both inventory hashes moved; the rendered line claimed 'Tracked status byte-identical across the episode' (WO-151 D020)",
    "The subject rule: the tracked-status hash stays the subject binding and the default-route refusal; the untracked listing is recorded beside it. The read-only analysis observed this worktree's own untracked docs/evidence/WO-157 files during the work, the session-writes hazard D020 cited against gating",
    "Filed receipts still project to themselves: `npm run entropy -- check` returns status ok after the change (REVIEW-002, REFUTATION-002 and REFUTATION-003 bound)",
    "Fail before: docs/evidence/WO-157/fixtures/item-09-10-before.tap — `confinement.scratchDelta.added` is undefined for a frozen copy that gained probe-output.txt and lost src/module.mjs. Pass after: docs/evidence/WO-157/fixtures/item-09-10-after.tap — the entropy fixtures 18 of 18; the receipt records added ['probe-output.txt'], removed ['src/module.mjs'], resized [], an unchanged tracked-path status and a changed untracked listing (count +1, no path name recorded), and renders '1 path(s) added, 1 removed, 0 resized'",
    "Changed existing expectations (criterion 17): the refutation confinement test now expects the path-set delta and its rendering, and strips the new untrackedListing field when it proves a pre-observation receipt still renders",
    "WO-157 review (items 8-11): unbounded path lists would add about 50 KB to a committed receipt; the item-9 fixture now also checks a 150-path delta lists 100 and counts 150"
  ],
  "rejected": [
    {
      "option": "Narrow the rendered claim only (the admitted alternative)",
      "reason": "It would leave D020's reopening case — a zero delta with a moved inventory hash — reachable in new receipts."
    },
    {
      "option": "Refuse a receipt whose untracked listing moved",
      "reason": "D020 recorded why: the dispatching session writes untracked files during every episode, so the default route would refuse its own receipts."
    },
    {
      "option": "Record the untracked path names",
      "reason": "They are operator working-tree names; the count and hash show movement without copying them into a committed receipt."
    }
  ],
  "unblocks": "The next Entropy Reducer pass: its receipts say only what the witness observes.",
  "goalAlignment": "Rule beating: a summary that overstated its witness is the trap; the sentence now names each observation and its limits. Escalation: no new refusal. NoOp keeps a misleading receipt line.",
  "reopenWhen": "A receipt reports a scratch delta that hides a moved inventory hash, or an episode is observed writing into the source repository in a way neither the tracked-path status nor the untracked listing records."
}
```

## WO-157-D011

```json
{
  "id": "WO-157-D011",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 item 10 (WO-151 D017), criterion 10",
  "decision": "Take the default route: a refutation receipt records no separate worker statement and renders an 'Attempt reasons' section listing each attempt's finding id, result, reason and evidence references from the typed report. `refutation-receipt --statement` is accepted but not recorded (a dispatch pending under the old instruction still files), and the worker instructions and printed file commands no longer ask for a statement. Filed refutations keep their statement and its rendering.",
  "evidence": [
    "Both live refutations (REFUTATION-002 and REFUTATION-003) ran on the launched claude-cli-print route, where the transport writes the CLI's final text — the JSON result — to capture/statement.txt (worker-transport.ts), and the launched prompt never asks for prose; the host then recorded and rendered the JSON as the statement (WO-151 D017)",
    "The admitted alternative (refuse a statement that parses as JSON) would refuse every launched claude-cli-print refutation and need an edit to worker-transport.ts, a registered feedback source",
    "Fail before: docs/evidence/WO-157/fixtures/item-09-10-before.tap — the filed refutation carries a `statement` key where the case expects none. Pass after: docs/evidence/WO-157/fixtures/item-09-10-after.tap — the receipt has no statement key, renders '## Attempt reasons' with each attempt, a receipt with a statement still renders '## Worker statement', `entropy check` is ok, and a refutation files without --statement"
  ],
  "rejected": [
    {
      "option": "Refuse --statement on refutation-receipt",
      "reason": "A dispatch pending under the earlier instruction would be stranded, and seventeen existing fixture calls pass it."
    },
    {
      "option": "Change the review route too",
      "reason": "The item names the refutation route; the review statement is a separate question no record raised."
    }
  ],
  "unblocks": "The next Entropy Reducer refutation: its receipt carries the reasons a planner disposes by, not a duplicated JSON blob.",
  "goalAlignment": "Seeking the wrong goal: a 'statement' that restates the typed report is volume, not evidence. NoOp repeats the 4,000-character JSON paragraph in every live refutation.",
  "reopenWhen": "A refutation route needs a free-prose worker account the typed report cannot carry, or a filed refutation stops projecting to itself."
}
```

## WO-157-D012

```json
{
  "id": "WO-157-D012",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 item 11 (WO-152 D012), criterion 11; receipt 027 known issue on who sets CLAUDE_EFFORT",
  "decision": "Validate rather than rewrite. The attestation source `claude-session-readback` is admitted only when the harness is claude-code, `CLAUDE_EFFORT` is present and valid, and it equals the attested effort (after the `ultra` normalization); otherwise the completion is refused, naming both values. While the variable is readable, a claude-code attestation of `unknown` is refused. Any other supplied effort under the variable is recorded as given with an advisory. Status and every lifecycle dispatch print `Current Claude Code session: effort <level>; source claude-session-readback; host-selected (CLAUDE_EFFORT), not effective effort.` when the variable is present and no Codex or Copilot session is. `docs/discovery/environment.json` gains the claude-code `selectedSessionReadback` row (observed at 2.1.280, value xhigh, scope 'selected, not effective', set by the Claude Code host, never by DotLn) and an observed persisted-selector row (key present; values not copied); `effectiveEffortReadback` stays 'not found'. `discover.mjs` now records the variable as a selected-session readback instead of an effective one. The role text says Claude Code exports and must be read. After the WO-157 review: the persisted-selector row records the key only (no placeholder value that would match `unknown`); a claude-code attestation under a readable CLAUDE_EFFORT that uses another source prints an advisory naming claude-session-readback; and the role text scopes the readback to the root session, because the variable is process-wide — the review observed it in an in-process subagent's shell, where it names the root's selection, so a subagent attests its own assigned effort as operator-attested.",
  "evidence": [
    "Observed in this session with printenv: CLAUDECODE=1, CLAUDE_EFFORT=xhigh, Claude Code 2.1.280; `npm run discover -- harness claude-code` recorded observedEffort xhigh through CLAUDE_CODE_EXECPATH. The persisted `effortLevel` key is present for three models in ~/.claude/settings.json (checked by key only)",
    "Who sets it: `grep -rn CLAUDE_EFFORT` over scripts and packages finds no writer; DotLn's transports pass the parent environment through and select effort with --effort. Whether a nested `claude -p` inherits the parent's value is unprobed and the row says so",
    "scripts/resume.mjs parseActor admitted any source string, so WO-152's reviewer could record `unknown` for a readable xhigh (WO-152 D012); the dead helper hasObservedEffortReadbackValue, which treated CLAUDE_EFFORT as effective readback, is removed",
    "Validate, not rewrite: requireReportActor compares a report's attestation header with the completion actor as an exact string, so silently rewriting the source would break every report written first; the briefing line lets the actor supply the source, as Codex readback works",
    "The operator-attested concrete mismatch is an advisory, not a refusal: an operator may attest another session's effort from a Claude shell. The order's 'the operator-selected value still refused if it disagrees' is read as the readback claim (refused when it disagrees) and the `unknown` case (a supplied or readable value never becomes unknown)",
    "Fail before: docs/evidence/WO-157/fixtures/item-11-before.log — claude-session-readback is accepted with no variable present ('Missing expected exception'), and the discovery probe writes an effectiveEffortReadback row. Pass after: docs/evidence/WO-157/fixtures/item-11-after.log — scripts/test-resume.sh passes, including a lifecycle refusal with no event appended, a completion recorded as claude-session-readback xhigh under CLAUDE_EFFORT=xhigh, and the status line; the process-debt discovery case passes",
    "Changed existing expectations (criterion 17): test-resume.sh now unsets the ambient CLAUDE_EFFORT (the gate passes it through to every suite) and its claude-code implementation-ready step records claude-session-readback under an explicit CLAUDE_EFFORT=xhigh instead of the free string harness-readback",
    "WO-157 review (items 8-11) reproduced the placeholder value hiding the 'no matching discovery observation' advisory for `unknown`, the role text overstating the refusal rule, and an equal operator-attested value recorded silently; all three are fixed, and scripts/test-resume.sh passes",
    "Changed existing expectation found by the first `npm test -- --review` (2026-09-23, skeleton 423 pass, 1 fail): packages/skeleton/test/executor-supports.test.ts 'WO-133 every generated role preserves supplied actor values' pinned the old 'Without effective readback, keep …' sentence; it now pins 'Without a session readback, keep … `--source operator-attested`; Claude Code roles read `CLAUDE_EFFORT` first' in all six roles (5 of 5 after rebuild). The test file is in no evidence inventory, so the editions stay current"
  ],
  "rejected": [
    {
      "option": "Rewrite --source automatically when the variable is present",
      "reason": "It breaks the exact report-header match and records a readback the actor never read."
    },
    {
      "option": "Refuse every operator-attested value that differs from the variable",
      "reason": "It makes the lifecycle depend on the shell the operator records from and refuses a legitimate attestation of another session."
    },
    {
      "option": "Call the variable effective effort",
      "reason": "It is the host's selection; product 07 and the security guide already distinguish selected from effective."
    }
  ],
  "unblocks": "WO-111 and every later Claude Code dispatch: effort drift rows stop reading `xhigh -> unknown` for a readable value.",
  "goalAlignment": "Correctness over sycophancy: the D012 error was an assertion of absence made without looking; the briefing line now puts the observation in front of every Claude Code role. Escalation: two narrow refusals, both of values the host contradicts. Tragedy of the commons: about 260 bytes of role text per Claude role (measured in D021).",
  "reopenWhen": "A Claude Code attestation disagrees with CLAUDE_EFFORT after WO-157 closes, the host stops exporting the variable, or a nested session is shown to inherit a parent's value."
}
```

## WO-157-D013

```json
{
  "id": "WO-157-D013",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 item 12 (WO-151 D001), criterion 12",
  "decision": "Take the default route with the addition the feedback edition requires. Register entropy-review-protocol.ts and mission-check-protocol.ts in commonSources and add both to the feedback subject (`FEEDBACK_SOURCE_PATHS`). Add an import-closure check, run by every edition script before it writes or checks: each relative runtime import of a registered source must be registered in that edition or listed in `evidenceImportExclusions` with a reason. The closure was worked to a fixed point: seventeen behaviour-bearing runtime siblings the registered hosts and protocols import are now registered in commonSources, and five families are excluded with reasons (config.mjs, the local-model actor and contract, the mission-check host and source; and, for the artifact-identity, verification and feedback editions only, harness.mjs and paths.mjs, which build.mjs loads only after compiling). Adjacent repair: the WO-142 test that meant to prove discovery-cli.ts is in every inventory iterated over the evidenceSources function itself and asserted nothing; it now calls evidenceSources(root) and asserts five inventories. After the WO-157 review: the feedback subject also carries plan-refutation-protocol.ts, and feedback-evidence refuses when any `*-protocol.ts` a subject file imports is missing from the subject; the import parser reads indented imports, import attributes, `import()` without await (skipping JSDoc `import(\"x\").T` types) and resolves a bare `@dotln/<package>` import to that package's `src/index.ts`, so the kernel's sources (index, core, store, types) are registered in commonSources.",
  "evidence": [
    "The feedback edition's staleness key is its subject, a hash over FEEDBACK_SOURCE_PATHS; the evidenceSources lists only admit preservation when an edition's output differs. The read-only analysis probed a scratch clone: registering the protocols in evidenceSources alone left `feedback --check` green over a changed protocol, and widening FEEDBACK_SOURCE_PATHS alone was masked by 'Retained immutable live feedback audit'. Both are required",
    "Computed with the new check on this tree: 21, 18, 14, 14 and 26 unregistered direct imports for the authority, artifact-identity, verification, feedback and harness inventories before registration; zero after the registrations and exclusions",
    "Exclusion reasons checked against source: scripts/feedback-evidence.mjs admits only claude-cli-print and codex-cli-exec for the self-host; verification-evidence records FakeVerificationTransport; no edition script imports the mission-check host or source (authority-evidence reads only the Contributor loadout's mission-check policy); scripts/build.mjs imports harness.mjs only after compiling, to preserve an installed runtime snapshot, and paths.mjs only for isMainModule",
    "Registering more files costs nothing when an edition's output is unchanged (the check verifies by exact equality) and makes preservation stricter only when output differs; the evidence rows run under --review when a registered source changes",
    "Fail before: the fixture (scripts/test-evidence-sources.mjs) is run against the base commit in the fail-before sweep (D018), where the feedback check stays green over a changed entropy review protocol. Pass after: recorded after the re-mint (D023), because its baseline needs a current feedback edition",
    "Known limitation, recorded: FEEDBACK_SOURCE_PATHS itself does not follow the import graph (the analysis measured a 19-module direct gap); widening it copies each module's bytes into every future self-host edition. The subject gains only the two protocols the item names",
    "WO-157 review (items 12-15) reproduced a comment-only change to plan-refutation-protocol.ts leaving the feedback subject hash unchanged, and four import forms the parser missed; the closure is still clean (zero unregistered imports in every inventory) after the wider parser and the kernel registration; the parser unit test covers each form"
  ],
  "rejected": [
    {
      "option": "Derive the registered sets by walking imports from the registered roots (the admitted alternative)",
      "reason": "It still needs the FEEDBACK_SOURCE_PATHS change and a plumbing exclusion list, and it moves the inventory with every refactor; an explicit list checked for closure keeps each registration a reviewed decision."
    },
    {
      "option": "Exclude every current gap with a reason",
      "reason": "Several gaps are behaviour-bearing runtime modules (the reactor driver, verification host, worker transport) whose exclusion reasons could not be defended; registering them is conservative and free when output is unchanged."
    }
  ],
  "unblocks": "WO-154, which enumerates behavioural inputs from the registered list, and every later edition check: a moved protocol or a new unregistered import can no longer pass silently.",
  "goalAlignment": "Rule beating: an edition that stays green while a compiled dependency moves is the exact trap; the check makes the inventory follow imports. Escalation: one check in five scripts, no new edition. Commons: the two protocol bodies add about 49 KB to each future self-host edition.",
  "reopenWhen": "An edition check passes over a changed protocol after WO-157 closes, an excluded module's reason stops holding (an edition starts dispatching a local-model actor or a mission check), or FEEDBACK_SOURCE_PATHS must follow the import graph."
}
```

## WO-157-D014

```json
{
  "id": "WO-157-D014",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 item 13 (WO-151 D021), criterion 13",
  "decision": "Add a `registrations` document-gate row (scripts/check-registrations.mjs) asserting that every JSONL under docs/ — tracked, or untracked and not ignored — is an EventEnvelope stream that round-trips byte-identically or is classified in the kernel's committed-JSONL registry, and that every script a document-gate task runs has a stub in the runner's CLI-selection fixture. The stub list moves to scripts/lib/document-gate-stubs.mjs, imported by both the fixture and the check; the new row's own script is on it. The row is also a machinery row over docs/, the stub list, the runner and the registry, so `npm test -- --review` runs it whenever a docs path changes.",
  "evidence": [
    "WO-151 D021: docs/control/entropy-reducer.jsonl was untracked during the executor's and verifier's runs, so the kernel's git-ls-files check never saw it, and runner-fixtures was not selected, so the missing entropy.mjs stub failed only at final review",
    "Scope choices: 'every suite whose task names a script' is read as every task the document selection spawns (plus the build row), because the CLI-selection fixture runs only those; the literal reading would demand stubs for about 31 suites the fixture never runs. Untracked files are included because committed-only would repeat D021's blind spot",
    "Measured on this tree: 'Registrations: 309 JSONL under docs/ (233 EventEnvelope streams, 76 classified); 21 document-gate tasks stubbed.'",
    "Fail before: docs/evidence/WO-157/fixtures/item-13-before.tap — the suite table has no registrations row ('test:docs carries the registration row (WO-151 D021)'). Pass after: docs/evidence/WO-157/fixtures/item-13-after.tap — a copy of the tree passes; a planted untracked docs/evidence/wo157-planted.jsonl fails naming the file; removing the entropy.mjs stub fails naming 'entropy runs scripts/entropy.mjs'; the existing CLI-selection test still passes with the row placed before `plan`"
  ],
  "rejected": [
    {
      "option": "Parse the stub list out of the test file",
      "reason": "Layout-dependent; an exported module is one list both sides read."
    },
    {
      "option": "Widen the kernel registry's control-segment pattern",
      "reason": "WO-151 D021 rejected it: the registry exists to notice the next unclassified stream."
    }
  ],
  "unblocks": "Every final review's product gate, the gate D021 failed.",
  "goalAlignment": "Shifting the burden: the registration is now owed at the change that creates the artifact, not discovered by a reviewer. Escalation: one document row of about half a second.",
  "reopenWhen": "A committed or untracked JSONL stream appears under docs/ that no registry classifies, or a document suite is added whose script the fixture does not stub, and a gate misses it after WO-157 closes."
}
```

## WO-157-D015

```json
{
  "id": "WO-157-D015",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 item 14 (WO-120 D007), criterion 14",
  "decision": "Take the digest route. A new allocation event records `sectionsHash`, the canonical digest of the generated section set it was written under; the fold validates the retained authority against the set that digest names, from a table that keeps every superseded set, and an event without the field uses the WO-120 set (digest pinned). An allocation whose retained authority fails validation makes only its own order unreadable: other control reads continue, its identity stays reserved, selecting it names the segment and the error, and the derived-order write path still refuses (naming it) until it is repaired. Storage-integrity errors — foreign ids, missing or unexpected activation, invalid segment names, duplicate ownership — remain fold-wide as test-control-segments.mjs expects. After the WO-157 review: with no explicit selection, an unreadable order is named rather than passed over (status and next refuse, naming its segment and error, instead of reporting no work order), and the index lists it as `unreadable` in Active; `work-orders index` and activation judge a derived authority by its allocation's section set too, so the fold, the index and activation all survive a section change.",
  "evidence": [
    "scripts/lib/control.mjs scanControl validated every allocation against the module constant `sections` in scripts/lib/derived-contract.mjs, and foldSegments rethrew any segment error, so one unfoldable allocation refused every control read (WO-120 D007)",
    "contractDigest of the WO-120 section list is 7613f5411a35ad4de06d32e30ceab8d117b15d129e147a63db6bf9c3ba806793 (computed with the module's own contractDigest)",
    "No WorkOrderIdentityAllocated event exists in this repository's control plane today (the read-only analysis grepped docs/control), so the change migrates nothing",
    "Write path, decided: replayAllocations validates every allocation before a new one is written, so materialization refuses while a retained allocation is corrupt. Allocating past an unreadable record would hide it; the refusal names the file",
    "Fail before: docs/evidence/WO-157/fixtures/item-14-before.tap — with 'Evidence' appended to the section list, the historical allocation refuses the whole fold, and a corrupt authority makes readControl throw for every order. Pass after: docs/evidence/WO-157/fixtures/item-14-after.tap — scripts/test-derived-orders.mjs 13 of 13; the superseded-set allocation folds with and without the digest field; with one corrupt allocation the other order reads as active, selecting the corrupt one throws 'unreadable work order WO-900: ... requires stable sections', `resume status --work-order` succeeds for the readable order and refuses naming WO-900.jsonl for the corrupt one",
    "The WO-113 catalog row already carries the dated note (docs/planning/work-order-map.md, WO-113 row: '2026-09-22: WO-157 criterion 14 versions the WorkOrderIdentityAllocated authority check ahead of this order's section contract')",
    "WO-157 review (items 12-15) reproduced an active corrupt order vanishing from unselected reads ('Work order: none') and the index and activation still using the current list; both are fixed, the dead `used` spread removed (the write path refuses before it), and the fixtures extended: the corrupt case asserts the unselected refusal and the unreadable index row, and the superseded-set case runs the modified tool's readIndex (scripts/test-derived-orders.mjs 13 of 13)"
  ],
  "rejected": [
    {
      "option": "An integer version instead of a digest",
      "reason": "It needs the same table and can drift from the literal it names; the digest reuses contractDigest."
    },
    {
      "option": "Default a digest-less event to the live section list",
      "reason": "It reintroduces the defect for events written before WO-157 in other launchpads."
    },
    {
      "option": "Skip a corrupt allocation in replayAllocations so derivation continues",
      "reason": "A write over an unreadable durable record would hide a corruption the operator must see."
    }
  ],
  "unblocks": "WO-113, which changes the generated section contract: historical allocation events keep folding across that change.",
  "goalAlignment": "Tragedy of the commons: one order's corrupt record no longer takes every control read down with it. Fixes that fail: the fold-wide refusals that guard storage integrity are kept.",
  "reopenWhen": "The section list changes after WO-157 closes and an allocation event fails to fold, or a derived file checked by `work-orders index` or activation meets a superseded section set (those checks still read the current list)."
}
```

## WO-157-D016

```json
{
  "id": "WO-157-D016",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 item 15 (WO-063 D005), criterion 15; receipt 027 known issue on a diagnosis-only route",
  "decision": "Fix the teardown at its cause and add the abandoned-root check. The gate-sandbox fixture sets `maintenance.auto=false` in its repository before the first commit. Each gate mints an eight-character tag, passes it to suites as DOTLN_GATE_FIXTURE_TAG, the fixture names its root `dotln-gate-sandbox-<tag>-*`, and after every suite has closed the gate fails, naming them, when any root with its tag survives; the check removes nothing and judges only its own tag, so a concurrent gate's live root or an untagged leftover never fails it. The race was reproduced and shown fixed, so the diagnosis-only route does not apply.",
  "evidence": [
    "Cause, confirmed by the read-only analysis and re-observed here: every `git commit` in the fixture starts `git maintenance run --auto --quiet --detach` (GIT_TRACE2_EVENT child_start). Git 2.55 estimates loose objects from objects/17 alone; two there make the detached child run a geometric repack writing .git/objects/pack while rmSync walks the tree (ENOTEMPTY). The surviving root dotln-gate-sandbox-HzuoRI holds only a pack whose final commit and tree ids are the two objects starting with 17",
    "Reproduced 2026-09-22 (docs/evidence/WO-157/fixtures/item-15-race.txt): the WO-140 partial test run 200 times, 10 concurrent, with two such objects planted before its last commit: 172 of 200 ENOTEMPTY and 172 roots left with the fix removed in memory; 0 of 200 and no roots as landed",
    "Rejected mechanisms checked: `--no-auto-maintenance` is refused by git init and git commit (exit 129); gc.auto=0 does not govern the geometric task; an rmSync retry is the blanket retry the item forbids",
    "Fail before: docs/evidence/WO-157/fixtures/item-15-before.tap — a fixture commit starts ['git maintenance run --auto --quiet --detach'], and a gate whose suite leaves a tagged root exits 0. Pass after: docs/evidence/WO-157/fixtures/item-15-after.tap — the WO-140 and WO-157 runner cases 11 of 11; the leaky gate exits 1 and names the root; another run's root in the shared temporary directory does not fail the clean gate and is left in place",
    "The pre-existing untagged root dotln-gate-sandbox-HzuoRI (2026-09-21) is left as the recorded symptom: the tag rule never judges it, and deleting it is outside this order's need",
    "The load reproduction is committed as an opt-in probe outside every gate (scripts/probes/gate-sandbox-race/race.mjs with its loader): 60 runs at 10 concurrent gave 52 ENOTEMPTY unfixed and 0 as landed (fixtures/item-15-race.txt)"
  ],
  "rejected": [
    {
      "option": "Retry rmSync (the WO-044 D013 style)",
      "reason": "The item forbids a blanket retry, and it keeps a background writer racing the fixture."
    },
    {
      "option": "Fail on any dotln-gate-sandbox-* root older than the run",
      "reason": "The temporary directory is shared by every worktree and session; an untagged age rule would blame this gate for another run's root, the 'failure with no owner' D005 named."
    },
    {
      "option": "Disable maintenance for every suite through the environment",
      "reason": "suiteEnvironment strips GIT_CONFIG_* on purpose so each suite observes its own fixture configuration."
    }
  ],
  "unblocks": "Every product gate and final review: this race could fail any gate for a reason unrelated to the order under review.",
  "goalAlignment": "Shifting the burden: a flaky gate no longer needs a reviewer to re-run it and argue it away. Rule beating: the check is run-owned, so it cannot be tripped or satisfied by another session's roots.",
  "reopenWhen": "The same subtest or any other fixture teardown reports ENOTEMPTY in a later gate, or a completed gate leaves a root carrying its own tag, after WO-157 closes."
}
```

## WO-157-D017

```json
{
  "id": "WO-157-D017",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 executor procedure step 1 ('commit per group')",
  "decision": "Make no branch commits. The group boundaries are recorded instead by the per-item decisions and fixture transcripts; the final reviewer composes the seam commits at final review, as WO-151's reviewer did.",
  "evidence": [
    "CLAUDE.md: 'No branch commits before final review.' The executor role text repeats it",
    "docs/product/07-execution-guide.md §Discipline, 'Recovery point before destruction': valid control transitions create the only pre-final-review checkpoint commits as local refs/dotln/checkpoint refs; hand-written checkpoint commits must not be added to the work-order branch",
    "The order's step 1 and its catalog row ('group commits by seam') conflict with that standing rule; the rule governs the executor and the order grants no exception"
  ],
  "rejected": [
    {
      "option": "Commit per group as the order's step 1 says",
      "reason": "It breaks the project's recovery and review model, which assumes the executor's work is uncommitted until final review."
    }
  ],
  "reopenWhen": "The operator directs per-group commits for this order, or the project rule changes."
}
```

## WO-157-D018

```json
{
  "id": "WO-157-D018",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 criterion 17 and receipt 027's known issue that a base failure must be the item's assertion, not a missing symbol",
  "decision": "Prove every fixture's fail-before twice: once in the working tree before each item's source change (the item-NN-before transcripts), and once more with the final fixture files in a shared clone of the base commit (docs/evidence/WO-157/fixtures/fail-before-sweep.txt). Fixtures that need new exports import them dynamically inside the test, so a base run fails on the item's assertion rather than on module linking.",
  "evidence": [
    "The sweep ran every item's fixture in a clone of 64ab40de with only the final test files and the writer-cli.mjs double copied in and the clone built from its own sources; every item fails there on its own assertion: item 1 Git's stash error instead of the refusal; item 2 the phase refusal; item 3 'observed' where 'thrown' is expected; item 4 the planted hook ran; item 5 ArtifactCompilationRefused recorded; items 6-7 '--model is required' and the missing refusals; item 8 the missing detail; items 9-10 the missing path sets and the recorded statement; item 11 'Missing expected exception' and the effective-readback row; item 12 'an edition check passed over a changed entropy review protocol'; item 13 no registrations row; item 14 the fold-wide refusals; item 15 the leaky gate exiting 0",
    "Two sweep notes: item 1 first failed in fixture setup (the clone had no local main branch for its bare-clone fixture) and was re-run after `git branch main origin/main`; item 15's maintenance case passes in the clone because its fix lives in the same test file's fixture helper, so its fail-before is fixtures/item-15-before.tap, recorded before that helper changed",
    "scripts/test-evidence-sources.mjs and the item 13 and CLI-selection cases in scripts/test-runner.test.mjs import the new modules dynamically for this reason",
    "The captured before-transcripts and the sweep carried trailing whitespace on the Node test reporter's whitespace-only diagnostic lines (42 lines across ten files); it was stripped on 2026-09-22 so an untracked-file `git diff --no-index --check` is clean, as WO-100's committed transcripts are. No other byte changed"
  ],
  "rejected": [
    {
      "option": "Rely only on the before-transcripts taken in the working tree",
      "reason": "Several fixtures were refined after their first run; a base clone judges the final bytes."
    }
  ],
  "reopenWhen": "A verifier shows a WO-157 fixture that passes against the base source or fails there on a missing symbol."
}
```

## WO-157-D019

```json
{
  "id": "WO-157-D019",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 Cost line ('the executor confirms the list against the registry at activation') and criterion 16",
  "decision": "Correct the order's list of edited registered sources from the registry itself and re-mint every edition. `packages/skeleton/src/dotln.ts` is in no inventory. This order changed eighteen registered files — artifact-identity.ts, verification-protocol.ts, verification-host.ts, source-change-host.ts, source-change-worktree.ts, portfolio.ts and portfolio-host.ts (every inventory); loadouts/executor-supports.ts and loadouts/contributor.ts (authority, feedback, harness); feedback-audit.ts, feedback-audit-source.test.ts and docs/discovery/environment.json (feedback); the five edition scripts; and scripts/lib/evidence-sources.mjs itself (every inventory) — plus the component manifests and lockfile at the bump (D020) and docs/control/budgets.json (harness) at the cold-start raise (D021). Because evidence-sources.mjs is in every inventory, all four writable editions (authority, artifact identity, verification, feedback) are re-minted under WO-157 and the harness chain re-run.",
  "evidence": [
    "Computed 2026-09-22 with evidenceSources(root) over `git diff --name-only HEAD` and the untracked files: the eighteen paths above, with the inventories named",
    "The order's Cost line named dotln.ts and worker-transport.ts; dotln.ts is unregistered (grep) and worker-transport.ts was registered for feedback only at the base and is now in commonSources; the order did not name source-change-host.ts, source-change-worktree.ts, portfolio.ts, portfolio-host.ts or contributor.ts, which items 3, 7 and 11 edit",
    "docs/evidence/current.json selected authority WO-100/002, artifact-identity WO-100, verification WO-146 and feedback WO-100/001 before the re-mint"
  ],
  "rejected": [
    {
      "option": "Re-mint only the editions whose output changed",
      "reason": "Criterion 16 requires every edition the registry selects for the edited sources, and evidence-sources.mjs selects all of them."
    }
  ],
  "reopenWhen": "A registered source changes after the re-mint on this branch (the next revision is then owed), or the registry's inventories are restructured."
}
```

## WO-157-D020

```json
{
  "id": "WO-157-D020",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 release classification (minor, assigned at activation) and criterion 16's component clause",
  "decision": "Assign application `v0.45.0` (the heading's placeholder, the README release block and a product 06 §Release boundary note) and bump the skeleton component from `0.37.0` to `0.38.0` with the console's exact pin, the console moving from `0.1.9` to `0.1.10`. Compiler and kernel sources are unchanged and keep their versions; `HARNESS_HOST_VERSION` is unchanged as every skeleton release since it last moved has left it.",
  "evidence": [
    "`git tag` and `git ls-remote --tags origin` both top out at v0.44.0 on 2026-09-22; no other order claims v0.45.0",
    "`git diff --stat HEAD -- packages/compiler/src packages/kernel/src packages/console/src` is empty; skeleton src changed (items 3, 5, 8, 12)",
    "Minor rather than patch: the order is classified minor and adds behaviour (a grant-bearing identity admitted, the refusal detail, the files and removal refusals)",
    "`npm run release -- check-surfaces --local`: 44 PASS after the bump; `npm run plan -- check` exits 0 after the heading change (the only heading change the plan gate admits)",
    "The bump precedes the feedback edition and its live episode, because the console's skeleton pin in package-lock.json is part of the feedback subject"
  ],
  "rejected": [
    {
      "option": "Skeleton 0.37.1 (patch)",
      "reason": "The classification is minor and the changes add behaviour."
    }
  ],
  "reopenWhen": "Final review's integration finds a newer tag or a sibling consuming v0.45.0 or skeleton 0.38.0 (the reviewer retimes under the same classification), or compiler or kernel source changes on this branch."
}
```

## WO-157-D021

```json
{
  "id": "WO-157-D021",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 execution step 3's cold-start clause (the standing 2026-09-17 route)",
  "decision": "Raise `limits.coldStartBytes.executor` in docs/control/budgets.json from 24,576 to the measured 25,150 plus one 4,096-byte step, 29,246, with a dated acceptance naming the two rules that grew the executor text: item 2's follow-up disposition sentence and item 11's Claude selected-session readback sentences.",
  "evidence": [
    "`node scripts/harness-context.mjs --check` after `npm run build` and `node scripts/harness.mjs emit --loadout contributor`: executor 25,150 bytes in both .claude/skills and .agents/skills against 24,576 (breach); verifier 21,860 of 25,151, reviewer 23,038 of 24,576, release-close 14,013 of 16,384, planner 16,161 of 24,576 (within); refuter unset",
    "Base 64ab40de: `git show HEAD:.claude/skills/dotln-executor/SKILL.md | wc -c` 18,299 plus CLAUDE.md 6,113 = 24,412 (within); CLAUDE.md is unchanged by this order",
    "The executor SKILL.md word diff against HEAD is the Follow-up Queue sentence, the readback sentence in the model-and-effort line and two completion-flag clauses, plus the origin comment's semantic hash",
    "Re-measured after the raise: executor 25,150 of 29,246 (within) in both roots"
  ],
  "rejected": [
    {
      "option": "Trim the new sentences or other executor text to fit 24,576",
      "reason": "The standing route forbids trimming reviewed rules around a ceiling; both sentences are order deliverables (items 2 and 11)."
    },
    {
      "option": "Record the breach as an acceptance without raising the ceiling",
      "reason": "The route admits either, but an unraised ceiling would leave the check reading breach on every later dispatch; raising it with the acceptance keeps the reason next to the number, as WO-146-D008 did for the verifier."
    }
  ],
  "reopenWhen": "A later pass reduces executor role text (then the ceiling can fall back), or another reviewed rule needs more than 29,246."
}
```

## WO-157-D022

```json
{
  "id": "WO-157-D022",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 items 2 and 11 change shared role text, and the process-debt role oracle already failed at base",
  "decision": "Add packages/skeleton/fixtures/wo157-role-baseline.json (historical baseline wo149-role-baseline.json with its sha256 ad6183e5…, and the current default and opt-out hashes of all twelve role files) and point the WO-145 oracle in scripts/test-process-debt.mjs at it, keeping every earlier snapshot byte-exact; the same fixture absorbs WO-151's planner dispatch line, which the WO-149 oracle never took in.",
  "evidence": [
    "A shared clone at base 64ab40de with its own package links, built with `npm run build`: `node --test --test-name-pattern \"WO-145 optional economy support\" scripts/test-process-debt.mjs` fails on .agents/skills/dotln-planner/SKILL.md (expected 2bc9e77e…, actual e1bcbdb7…), so the oracle was already red before this order",
    "789d687f (WO-151, 'Dispatch the Entropy Reducer with one command') added one planner line and left wo149-role-baseline.json unchanged; its last change is f0311af8",
    "After the new fixture: the same test passes in this worktree (1 pass, 0 fail); the fixture and the test are in no evidence inventory"
  ],
  "rejected": [
    {
      "option": "Rewrite wo149-role-baseline.json's hashes",
      "reason": "The test forbids rewriting a historical snapshot to make the current check pass; each authorized edit gets a new oracle that chains to the previous one by hash."
    },
    {
      "option": "Leave the pre-existing planner drift for another order",
      "reason": "Adjacent Repair prefers a bounded repair to an encountered defect; this order's own role edits need a new oracle anyway, and one fixture covers both."
    }
  ],
  "reopenWhen": "Another order changes generated role text (it adds its own oracle chained to this one)."
}
```

## WO-157-D023

```json
{
  "id": "WO-157-D023",
  "date": "2026-09-22",
  "dispatch": "resume: next; WO-157 criterion 16 and execution step 3 (one re-mint with one live feedback self-host episode, WO-147 D010)",
  "decision": "Re-mint every edition once, after the last registered-source edit, and select them in docs/evidence/current.json: authority WO-157 revision 001, artifact identity WO-157, verification WO-157, feedback WO-157 revision 001. Run the live self-host episode on `claude-cli-print` with `claude-sonnet-5` at `xhigh` (the selection that completed WO-100's episode) in one store, retrying the retained command once after an `invalid-result` refusal, and record the completed streams. Re-record the console self-host fixture and re-run the harness evidence check.",
  "evidence": [
    "Order of work on 2026-09-22/23: `npm run build`; `harness emit` and `check --loadout contributor` (31 surfaces); the cold-start raise (D021); then `node scripts/authority-evidence.mjs --write` and `--check`; `npm run evidence:artifact -- --write` and `--check` ('Seiri semantic hash and frozen oracle unchanged'); `npm run evidence:verification -- --write` and `--check` ('planted defect, repair, staleness and replay are green'); `npm run evidence:feedback -- --write` ('ten passing regressions, ten removal failures, and 1192 fewer instruction bytes'). No registered source changed afterwards",
    "Attempt 1, 2026-09-23T00:17:25Z: `DOTLN_LIVE_WORKERS=1 npm run dotln -- feedback-audit --store .runtime/feedback-audit-wo157-r001 --transport claude-cli-print --model claude-sonnet-5 --effort xhigh` on Claude Code 2.1.280 printed 'worker refused: invalid-result (finding shape); pending work is retained' and exit 1; the store recorded WorkerInterrupted {reason invalid-result, detail 'finding shape'}; usage row (claude-result-envelope): 282,226 ms, 1,364,052 tokens (33,196 output), USD 1.8980914",
    "Attempt 2, 2026-09-23T00:22:41Z, same command and store: complete, ten fixtures, 1,192 saved instruction bytes, verifier claude-cli-print; usage row: 31,224 ms, 937,199 tokens (2,698 output), USD 1.4015924. Episode total: 313,450 ms of launch, 2,301,251 tokens, USD 3.2996838. Effective model and effort are unknown (the attempt records host-launch selection)",
    "The refusal named its cause only because of item 8 (D009): WO-152's two refused episodes recorded no detail. The cause is analysed in D024",
    "`node scripts/feedback-evidence.mjs --record-selfhost .runtime/feedback-audit-wo157-r001` then `--check`: verified; the verification stream is 2,191,208 bytes (308 WorkerHeartbeat events; corrected by D029) against WO-100's 1,946,647 (355)",
    "`npm run evidence:console -- --record-current-selfhost` then `--check`: wo009, selfhost, control, refutations and missing all match; `node scripts/harness-evidence.mjs`: 31 current generated surfaces, historical smokes unchanged",
    "Item 12's pass-after needs a current feedback edition, so it ran here: `node --test scripts/test-evidence-sources.mjs` 2 of 2 (fixtures/item-12-after.tap)"
  ],
  "rejected": [
    {
      "option": "Effort max, the README's documented selection",
      "reason": "WO-100's max attempt reached the transport's 600,000 ms deadline with no result; xhigh completed there."
    },
    {
      "option": "A new store for the retry",
      "reason": "The retained command is the recovery the CLI prints; a new store would discard the refused attempt's record."
    }
  ],
  "reopenWhen": "A registered source changes on this branch after the re-mint (a new revision is then owed), or final review's integration finds a sibling edition selected in current.json."
}
```

## WO-157-D024

```json
{
  "id": "WO-157-D024",
  "date": "2026-09-23",
  "dispatch": "resume: next; the first live attempt of D023 refused with invalid-result (finding shape)",
  "decision": "Board up, not fix in this order: the verifier's output schema admits findings the admission validator can never accept. When a subject carries no failing witness (as every feedback self-host does), `findingContract` is empty, so `evidenceResultSchema` gives observed, expected and reproductionSteps as free strings and arrays with no minItems, maxLength or control-character rule, and any finding at all is inadmissible there (a finding needs a failing evaluation, which needs a failing witness). Claude's `--json-schema` constrains the model to that looser schema, and copyFinding refuses the result as 'finding shape'. Fixing it edits verification-protocol.ts, registered in every inventory and in the feedback subject, which would force a second full re-mint and another paid live episode against criterion 16's single re-mint.",
  "evidence": [
    "packages/skeleton/src/verification-protocol.ts: schemaText is {type: 'string'} and schemaTexts an array of it; findingContract takes observed, expected and steps only from adverse (outcome 'fail') witnesses and from a snapshot's tests; the findings array has no maxItems",
    "packages/compiler/src/verification.ts copyFinding requires verificationLine strings (1-2,000 characters, no control characters), non-empty reproductionSteps, evidenceRefs and likelySurface (at most 100), and repository paths; validateEvidenceResult then requires the finding's evaluation to be 'fail' and 'unsupported failure' requires a failing witness",
    "packages/skeleton/src/worker-transport.ts passes JSON.stringify(transportResultSchema(request)) as claude-cli-print's --json-schema",
    "The feedback self-host subject's two witnesses are both outcome pass (WO-100's recorded VerificationOpened; the same builder here)",
    "Inference, not observation: attempt 1's raw output is not stored by design (D009), so which finding field failed is unknown; the confirmed defect is that the schema admits what the validator refuses. WO-152 D009's two unexplained refusals (USD 2.72) may share the cause; unproven",
    "Cost of the refused attempt: USD 1.8980914, 1,364,052 tokens, 282,226 ms (D023)"
  ],
  "rejected": [
    {
      "option": "Fix the schema now and re-mint again",
      "reason": "A second registered-source edit after the re-mint breaks criterion 16's 'once, after the last registered-source edit' and needs another paid live episode (USD 1.4-3.3 on today's figures) for a defect whose live effect is stochastic; the order authorizes one live episode."
    },
    {
      "option": "Record only the retry, with no follow-up",
      "reason": "The gap is concrete and costs a paid attempt whenever a verifier emits any finding on an all-pass subject."
    }
  ],
  "followup": "Tighten evidenceResultSchema to copyFinding's rules: findings maxItems 0 when the subject has no failing witness, and otherwise minItems 1 on reproductionSteps, evidenceRefs and likelySurface, string minLength 1 and maxLength 2000 with no control characters, and likelySurface limited to the criterion's codeSurfaces; add a fixture proving every schema-valid finding shape the validator refuses is now schema-invalid; land it with the next order that re-mints the feedback edition (WO-154 is queued for editions), and read back any later live 'finding shape' refusal.",
  "reopenWhen": "A later live verifier episode refuses with 'finding shape' or another schema-admitted shape, or an order edits verification-protocol.ts for another reason."
}
```

## WO-157-D025

```json
{
  "id": "WO-157-D025",
  "date": "2026-09-23",
  "dispatch": "resume: verify; VER-001 F1, WO-157 criterion 3",
  "decision": "Return the file-to-directory refusal's missing ceiling to repair. The authority boundary works, but criterion 3 requires both the path and ceiling in that diagnostic; D004's claim that both refusals name the ceiling was too broad.",
  "evidence": [
    "packages/skeleton/src/source-change-worktree.ts emits 'source-change diff removes or changes the type of paths without repo.delete: D fixture.txt' for the directory replacement, without the configured files ceiling",
    "packages/skeleton/test/source-change-host.test.ts supplies files: 3 and anchors the expected message at D fixture.txt; the recorded item-03-after.tap passes that narrower assertion",
    "The fresh npm test product gate passed 27 suites, 0 failed in 287.34 s; it does not establish the missing diagnostic clause"
  ],
  "rejected": [
    {
      "option": "Treat the passing refusal fixture as satisfying the ceiling wording",
      "reason": "Its anchored assertion and actual error omit the configured ceiling named by criterion 3."
    }
  ],
  "followup": "resume: fix WO-157 VER-001 F1: keep the file-to-directory refusal and path, add the configured files ceiling to its diagnostic, assert both in the fixture, and rerun the affected source-change checks.",
  "reopenWhen": "The repaired diagnostic or fixture still omits the configured ceiling, or a change to the refusal permits a deletion without repo.delete."
}
```

## WO-157-D026

```json
{
  "id": "WO-157-D026",
  "date": "2026-09-23",
  "dispatch": "resume: verify; VER-001 F2, WO-157 criterion 9",
  "decision": "Return the untracked-path witness's ambiguous hash framing to repair. The ordinary add/remove fixture passes, but two different legal filename lists can render 'untracked listing unchanged', so the summary exceeds the observation.",
  "evidence": [
    "scripts/lib/entropy-review.mjs untrackedListing reads NUL-delimited Git paths but hashes paths.join('\\n'); widenedWitness compares only the resulting hashes",
    "In-memory execution of the current functions with NUL-delimited Git outputs gave before ['a\\nb','c'] and after ['a','b\\nc'], each count 2 and SHA-256 ea7fb08b7a2dc4619ffb7c7bb38d95a2047935fa165d71b12efd3852a2e6d0cc; widenedWitness recorded identical: true",
    "Git permits newline characters in path names; the current item-09-after.tap tests ordinary added and removed scratch paths, not this framing case"
  ],
  "rejected": [
    {
      "option": "Treat equal counts and hashes as an exact path observation",
      "reason": "Newline joining maps the reproduced distinct legal path lists to the same hash input."
    }
  ],
  "followup": "resume: fix WO-157 VER-001 F2: hash an unambiguous representation of the NUL-delimited untracked paths, add a delimiter-containing filename fixture that must record identical: false, and retain historical receipt rendering.",
  "reopenWhen": "A changed untracked path listing still records identical: true, or the repair changes the meaning of retained historical receipts."
}
```

## WO-157-D027

```json
{
  "id": "WO-157-D027",
  "date": "2026-09-23",
  "dispatch": "resume: verify; VER-001 F3, WO-157 criterion 11",
  "decision": "Return the same-session effort mismatch to repair. D012's advisory-only interpretation does not satisfy the order's instruction to refuse a disagreeing operator-selected value or criterion 11's source and value under CLAUDE_EFFORT; the lifecycle event has no separate-session provenance that would identify its stated exception.",
  "evidence": [
    "parseActor('verification-result', claude-code 2.1.280, effort high, source operator-attested, env CLAUDE_EFFORT=xhigh) returns high/operator-attested with only an advisory; no event was written in this reproduction",
    "scripts/resume.mjs checks equality only for source claude-session-readback and refuses unknown under a readable variable, then warns for every other concrete mismatch; scripts/test-resume.sh explicitly expects high/operator-attested to pass",
    "WO-157 item 11 says the operator-selected value still refuses on disagreement; criterion 11 says a lifecycle dispatch with CLAUDE_EFFORT set records claude-session-readback and the variable's effort"
  ],
  "rejected": [
    {
      "option": "Accept D012's advisory-only mismatch as a same-session exception",
      "reason": "The completion event has no distinct-session provenance and can record a wrong value for the current Claude Code session."
    }
  ],
  "followup": "resume: fix WO-157 VER-001 F3: refuse a same-session Claude Code completion whose effort or source disagrees with a readable CLAUDE_EFFORT, assert the negative lifecycle case without an appended event, and preserve a separately proven cross-session attestation only through an explicit provenance contract and authorized order amendment.",
  "reopenWhen": "A lifecycle completion under a readable CLAUDE_EFFORT can again record a different effort or source without evidence that it attests a distinct session."
}
```

## WO-157-D028

```json
{
  "id": "WO-157-D028",
  "date": "2026-09-23",
  "dispatch": "resume: verify; VER-001 F4, WO-157 item 12 and criterion 12",
  "decision": "Return the import-closure check's missed runtime forms to repair. The named changed-protocol and excluded-import fixtures pass, but the promised refusal for an unregistered imported sibling does not hold for legal chained dynamic imports or semicolonless static imports.",
  "evidence": [
    "scripts/lib/evidence-sources.mjs IMPORT_PATTERN requires a semicolon on static imports and rejects every import() followed by a dot to avoid TypeScript/JSDoc import types",
    "With a process-local readFileSync shim over registered verification.ts, import './unregistered.mjs'; is collected and named, while void import('./unregistered.mjs').then(() => {}) and semicolonless import './unregistered.mjs' both yield no unregistered finding; no disk file was changed",
    "scripts/test-evidence-sources.mjs tests a semicolon-bearing static import and unchained import(); no current production dependency omitted by the two forms was found"
  ],
  "rejected": [
    {
      "option": "Rely on the passing named protocol fixture and current source inventory",
      "reason": "Item 12 promises refusal when a registered source gains an unregistered runtime import; both reproduced legal forms bypass the check."
    }
  ],
  "followup": "resume: fix WO-157 VER-001 F4: recognize legal chained dynamic imports and semicolonless static imports while excluding only type imports, add both negative-control fixtures, then re-mint every edition selected by the registered source edit with the required live feedback episode and recheck them.",
  "reopenWhen": "An edition --check passes after a registered source imports an unregistered runtime sibling through either form."
}
```

## WO-157-D029

```json
{
  "id": "WO-157-D029",
  "date": "2026-09-23",
  "dispatch": "resume: verify; correction to D023's live-stream count",
  "decision": "Correct D023's heartbeat count from 310 to 308; the completed live episode and its byte count are unchanged.",
  "evidence": [
    "D023 said 310 heartbeats in docs/evidence/WO-157/feedback-001/selfhost-verification.jsonl",
    "rg -c '\"type\":\"WorkerHeartbeat\"' on that committed stream returns 308",
    "The intended observation was the count of WorkerHeartbeat events in that stream; D023 now states 308 and cites this correction"
  ],
  "rejected": [
    {
      "option": "Retain the unsupported 310 count",
      "reason": "The committed stream contains 308 matching WorkerHeartbeat events."
    }
  ],
  "reopenWhen": "A replay or edition check shows that the committed stream's event count differs from 308."
}
```

## WO-157-D030

```json
{
  "id": "WO-157-D030",
  "date": "2026-09-23",
  "dispatch": "resume: fix; the operator's `scope expand:` during the repair (paraphrased: a fix the executor pass deferred only to avoid another re-mint is done now; a fix deferred for larger reasons may stay deferred, which the operator authorizes)",
  "decision": "Apply the operator's rule to the order's two deferred fixes. adjacent-0002 (D024, FUP-c31c7bcab9270f49), the verifier output schema admitting findings admission refuses, was deferred only because its fix edits a registered source and would force a second re-mint and paid live episode; this repair re-mints anyway, so it is fixed here as the order's item 16 and criterion 20. adjacent-0001 (D005, FUP-92fd86e53b44fa39), an OS sandbox for writer-controlled test code, was deferred for larger reasons and stays deferred under the operator's authorization. The repair re-mints every edition the registry selects once more, after its last registered-source edit, as new revisions with one new live feedback self-host episode; the first WO-157 revisions stay on disk as the record VER-001 judged. The order text gains the appended section 'Operator scope expansion — 2026-09-23' and is bound by `plan amend-order`.",
  "evidence": [
    "The adjacent queue's disposition of adjacent-0002 gives one reason: 'landing it now would force a second re-mint and another paid live episode against WO-157 criterion 16's single re-mint'; D024's only rejected-option reason is the same",
    "The repair must re-mint regardless: VER-001 F1 edits packages/skeleton/src/source-change-worktree.ts and F4 edits scripts/lib/evidence-sources.mjs, both registered in all five inventories (evidenceSources(root), 2026-09-23), and source-change-worktree.ts is in FEEDBACK_SOURCE_PATHS, so the feedback subject moves and validateSelfhost refuses the recorded streams",
    "adjacent-0001's disposition and D005's knownLimit give larger reasons: it is a new containment mechanism (an OS sandbox with no network and worktree-confined writes, on macOS and Linux) beyond item 4's publish guard; product 03 states the source-change host is 'not OS isolation of arbitrary test scripts'; it predates WO-157; its deadline is WO-066's first target publication",
    "Editions are immutable (feedback-evidence.mjs immutableWrite: 'evidence edition is immutable; choose a new edition'), so a second mint is a new revision, not a rewrite"
  ],
  "rejected": [
    {
      "option": "Keep adjacent-0002 deferred to WO-154",
      "reason": "The operator's rule selects it, and its sole deferral reason no longer holds; the new live episode would otherwise run under the schema gap that refused D023's first attempt (USD 1.90)."
    },
    {
      "option": "Also land adjacent-0001 now",
      "reason": "Its deferral rests on product scope and a cross-platform design, not on re-mint cost; the operator authorized that deferral to continue."
    },
    {
      "option": "Delete the uncommitted WO-157 revision-001 editions and mint again at the same paths",
      "reason": "It destroys the live episode and editions VER-001 judged and D023, D024 and D029 cite; new revisions keep both records."
    }
  ],
  "reopenWhen": "The operator withdraws the scope expansion before re-verification, the tightened schema is refused by a live transport, or a later pass shows adjacent-0001's deferral rested on re-mint cost after all."
}
```

## WO-157-D031

```json
{
  "id": "WO-157-D031",
  "date": "2026-09-23",
  "dispatch": "resume: fix; VER-001 F1 and D025's named repair; WO-157 criterion 3",
  "decision": "Name the path count and the configured files ceiling in the removal and type-change refusal as well as the removed paths: 'source-change diff removes or changes the type of paths without repo.delete (<n> paths against the envelope's files ceiling of <c>): D <path>, ...', or '... against no files ceiling' when the envelope carries none (a non-portfolio order). The authority rule, its ordering after the count refusal and the Sort exemption are unchanged.",
  "evidence": [
    "packages/skeleton/src/source-change-worktree.ts checkChangeLimits: the removal refusal printed only 'without repo.delete: D fixture.txt' for an envelope with files 3 (VER-001 F1)",
    "Fail before: docs/evidence/WO-157/fixtures/repair-fail-before-sweep.txt, F1 — against refs/dotln/checkpoint/WO-157/5 the case's anchored assertion meets 'source-change diff removes or changes the type of paths without repo.delete: D fixture.txt'. Pass after: docs/evidence/WO-157/fixtures/repair-after.tap — the directory replacement refuses with '(3 paths against the envelope's files ceiling of 3): D fixture.txt', the same change with no ceiling with '(3 paths against no files ceiling)', and the undeclared Sort move with '(2 paths against the envelope's files ceiling of 2)'",
    "The count refusal runs first, so a removal refusal always reports a count within the ceiling"
  ],
  "correction": {
    "misread": "D004 said the refusals name the paths and the ceiling; only the count refusal named the ceiling.",
    "meant": "Criterion 3 asks both the over-ceiling and the file-to-directory refusals to name the paths and the ceiling.",
    "changed": "The removal refusal now names the ceiling, and the fixture asserts it for both refusals."
  },
  "rejected": [
    {
      "option": "Omit the clause when the envelope carries no ceiling",
      "reason": "The diagnostic would then look the same whether or not a ceiling was checked; 'no files ceiling' says what was enforced."
    }
  ],
  "reopenWhen": "The removal diagnostic or its fixture again omits the configured ceiling, or a change to the refusal admits a removal without repo.delete."
}
```

## WO-157-D032

```json
{
  "id": "WO-157-D032",
  "date": "2026-09-23",
  "dispatch": "resume: fix; VER-001 F2 and D026's named repair; WO-157 criterion 9",
  "decision": "Read the untracked listing untrimmed through runGitPathList, and hash each path list the witness binds as its sorted paths with every path NUL-terminated (`pathListDigest`, exported from scripts/lib/entropy-review.mjs). A path may contain a newline or begin with whitespace but never NUL, so two different lists never hash the same bytes. The hashing applies to the source repository's untracked listing and, as bounded adjacent repair, to the added, removed and resized scratch path sets, which were joined the same way. The path-and-size inventory hash is unchanged: each of its rows carries a NUL and a newline-free size, so its newline join was already unambiguous.",
  "evidence": [
    "scripts/lib/entropy-review.mjs untrackedListing hashed paths.join('\\n') and scratchPathDelta bound each set by hex(paths.join('\\n')) (VER-001 F2); untrackedListing also read Git's output through runGit, which trims it (scripts/lib/git.mjs, trim defaults to true), so a first path's leading whitespace was lost. The repair's independent review reproduced that second collision with real Git: untracked ' a' and 'b' replaced by 'a' and 'b' recorded identical true",
    "Fail before: docs/evidence/WO-157/fixtures/repair-fail-before-sweep.txt, F2 — untracked files 'a\\nb' and 'c' at dispatch, replaced by 'a' and 'b\\nc' before filing, record before and after SHA-256 ea7fb08b7a2dc4619ffb7c7bb38d95a2047935fa165d71b12efd3852a2e6d0cc (the verifier's reproduced value). Pass after: docs/evidence/WO-157/fixtures/repair-after.tap — for that pair and for ' a','b' replaced by 'a','b': equal counts, different hashes, identical false, the rendered line reads '**false**'; the two scratch sets hash differently",
    "No filed receipt or pending dispatch carries the widened witness: `grep -rl 'listedPerSet\\|untrackedListing' docs/` finds only this order's decisions, VER-001 and the follow-up register, and the widened witness is unreleased (v0.45.0), so no retained receipt changes meaning; earlier receipts keep their rendering (D010)"
  ],
  "correction": {
    "misread": "D010 treated the count and SHA-256 of the newline-joined listing as an exact observation of the path list.",
    "meant": "The witness must record identical false whenever the listing changes.",
    "changed": "The listing and the scratch path sets are hashed NUL-terminated; a fixture with newline-bearing names proves it."
  },
  "rejected": [
    {
      "option": "Hash JSON.stringify of the list",
      "reason": "Also unambiguous, but NUL framing matches the NUL-delimited listing Git already returns and needs no encoding rule."
    },
    {
      "option": "Record a framing version in the receipt",
      "reason": "No filed receipt or pending dispatch uses the earlier framing, so there is nothing to tell apart."
    },
    {
      "option": "Keep runGit and only change the join",
      "reason": "The review showed the trim alone still maps two listings to one hash."
    }
  ],
  "reopenWhen": "A changed untracked listing or scratch path set records the same hash, or a filed receipt is found whose hash used the newline framing."
}
```

## WO-157-D033

```json
{
  "id": "WO-157-D033",
  "date": "2026-09-23",
  "dispatch": "resume: fix; VER-001 F3 and D027's named repair; WO-157 item 11 and criterion 11",
  "decision": "While CLAUDE_EFFORT is a readable level, a claude-code attestation must be `--effort <that value> --source claude-session-readback`. Any other effort or source, `unknown` included, is refused before any event is written, naming the value to attest. `claude-session-readback` is still refused wherever the variable is absent or differs, and without the variable `operator-attested` records as before. Other harnesses are not judged: a human's completion run with `!` in a Claude Code session, or a Codex process started from one, inherits the variable and legitimately records another harness. The refusal names the effort and source as typed. The role text's Completion flags sentence and docs/AI-HARNESS-SECURITY.md now state the refusal and that the root session records lifecycle completions, because a subagent's shell carries the root's value. No cross-session provenance contract is added; D027 names that as needing an authorized order amendment, and none was given.",
  "evidence": [
    "scripts/resume.mjs parseActor warned and recorded high/operator-attested under CLAUDE_EFFORT=xhigh (VER-001 F3); scripts/test-resume.sh expected that",
    "Only scripts/resume.mjs (every lifecycle completion) and scripts/refute-plan.mjs (plan override's optional identity) call parseActor (`git grep -l parseActor -- scripts packages/*/src .claude .codex`)",
    "Fail before: docs/evidence/WO-157/fixtures/repair-fail-before-sweep.txt, F3 — 'Missing expected exception' for high/operator-attested under CLAUDE_EFFORT=xhigh. Pass after: docs/evidence/WO-157/fixtures/repair-after.tap — test-resume.sh passes: a differing effort, an equal effort from operator-attested and the legacy source spelling are refused; a lifecycle implementation-ready with --effort high --source operator-attested under CLAUDE_EFFORT=xhigh is refused and appends no event; the codex-cli harness is not judged; the existing claude-session-readback completion records xhigh",
    "Changed existing expectations (criterion 17): scripts/test-resume.sh's high/operator-attested case now expects the refusal; scripts/test-worktree.sh now unsets the ambient CLAUDE_EFFORT, as test-resume.sh does, because its fixture attests claude-code with source self-reported and the gate passes the variable through (scripts/lib/suite-evidence.mjs). Checked directly: those flags under CLAUDE_EFFORT=xhigh are now refused. The role oracle packages/skeleton/fixtures/wo157-role-baseline.json (this order's own, D022) takes the twelve changed role hashes",
    "Role text: executor 25,183 bytes of 29,246, reviewer 23,071 of 24,576 and verifier 21,893 of 25,151 after `harness emit`; `harness check --loadout contributor` passes (31 surfaces)",
    "The repair's independent review found no flow wrongly refused: only scripts/test-resume.sh and scripts/test-worktree.sh run claude-code completions under the gate, and both unset the variable; no hook runs a completion; the claude-code actors in the entropy, live-smoke and subagent-probe code are object literals, not parseActor calls. It noted the harness key is the literal 'claude-code' (so '--harness claude' is not judged) and that the refusal named the normalized source; the message now names the supplied spelling"
  ],
  "correction": {
    "misread": "D012 read the item's 'the operator-selected value still refused if it disagrees' as covering only the readback claim and unknown, and kept a differing operator-attested value as an advisory so an operator could attest another session from a Claude shell.",
    "meant": "Criterion 11: with CLAUDE_EFFORT set, a lifecycle dispatch records claude-session-readback and the variable's effort. Nothing in the event says a differing value describes another session, so recording it is recording a wrong value for this one.",
    "changed": "The mismatch and any other source are refused under a readable variable; role and security text say so."
  },
  "rejected": [
    {
      "option": "Keep the advisory and add a field naming the attested session",
      "reason": "It is the explicit provenance contract D027 reserves for an operator-authorized amendment; the scope expansion did not include it."
    },
    {
      "option": "Refuse only a differing effort and keep an equal effort from operator-attested",
      "reason": "Criterion 11 names the source too, and D027 asks for refusal when the effort or the source disagrees."
    }
  ],
  "reopenWhen": "A legitimate flow must record a claude-code attestation for another session from a shell with CLAUDE_EFFORT set (then a provenance contract is owed), or a nested session is shown to inherit a parent's value."
}
```

## WO-157-D034

```json
{
  "id": "WO-157-D034",
  "date": "2026-09-23",
  "dispatch": "resume: fix; VER-001 F4 and D028's named repair; WO-157 item 12 and criterion 12",
  "decision": "Read imports from code tokens produced by TypeScript's own scanner (typescript/unstable/ast createScanner, the entry point packages/skeleton/src/feedback-source-comments.ts already uses), instead of a text pattern. Comments are skipped and strings, templates and regular expressions are lexed whole, so a quote, semicolon or `import` inside them is never syntax; a `/` after a value is division, otherwise a regular expression, and a `}` closing `${` resumes its template. From the tokens: a static import is `import` followed by names, commas, `*`, `as` and brace groups, then `from \"x\"` (or `= require(\"x\")`), with or without a semicolon; a side-effect import is `import \"x\"`; a re-export is `export *` [as name] or `export {...}`, then `from \"x\"`; a dynamic import is `import(\"x\")` with an options argument, no member, or a chained `.then`, `.catch` or `.finally`. Skipped are only `import type`, `export type`, a code type reference `import(\"x\").T` (JSDoc types are comments), `import.meta`, a member or property named import, and computed specifiers. The reader refuses to run on a TypeScript version other than 7.0.2, as feedback-source-comments.ts does, so a scanner change is rechecked rather than trusted.",
  "evidence": [
    "scripts/lib/evidence-sources.mjs IMPORT_PATTERN required a static import's semicolon and rejected import() followed by any dot (VER-001 F4)",
    "The repair's independent review showed my first repair, a grammar-shaped regex, dropped forms the checkpoint parser caught: a quote or semicolon in a clause comment, string-named specifiers (`import { \"a-b\" as ab }`, `export * as \"ns\"`), a byte-order mark before the first import and `$` in a specifier; and that it counted a type import following `import.meta`, and backtracked quadratically on long whitespace. The token reader handles each; the fixture covers them",
    "Context7 (/microsoft/typescript, v7.0.2 scanner source, queried 2026-09-24) confirms createScanner(true, …) consumes comments as trivia, and that reScanSlashToken ends a regular expression at a line break, so a misjudged `/` can mislex at most its own line",
    "Fail before: docs/evidence/WO-157/fixtures/repair-fail-before-sweep.txt, F4 — the checkpoint's feedback check admits a registered verification.ts importing './wo157-unregistered.js' through `void import(...).then(...)`, and the parser fixture misses the new forms. Pass after: docs/evidence/WO-157/fixtures/repair-after.tap (the parser fixture) and repair-item-12-after.tap after the re-mint (D036): both of the verifier's forms refuse by name through `feedback-evidence --check`; the parser reads nineteen runtime forms, including the review's cases, two imports on one line, a comment before an import and inside `import(`, and an import-equals require, and skips five type forms and code that only mentions an import (strings, a regular expression, a template expression, a property and a method named import)",
    "Old and new readers give identical imports for all 122 registered sources, and every inventory still has zero unregistered imports (checked 2026-09-24 against the checkpoint's parser; 0.25 s for both readers over all sources)"
  ],
  "correction": {
    "misread": "D013 said the parser reads indented imports, attributes and unchained import() and called the closure clean. In my first repair I then recorded that TypeScript 7.0.2 exposes no JavaScript parser API, having checked only the package's main export (two keys).",
    "meant": "Item 12 promises a refusal whenever a registered source imports an unregistered sibling at run time, in any legal form. The installed package exports typescript/unstable/ast, including createScanner, which this repository already uses.",
    "changed": "The reader tokenizes with that scanner; the fixture covers the verifier's and the review's forms; the regex and its recorded rationale are withdrawn."
  },
  "knownLimit": "A `/` whose regular-expression or division reading needs the parser (for example directly after `}` or `)` of a control statement) is judged by the previous token and can mislex its own line; `require` through createRequire and computed specifiers name no file and are not read; `typeof import(\"x\")` is counted, which errs toward refusing.",
  "rejected": [
    {
      "option": "Keep the grammar-shaped regex",
      "reason": "The review showed it regressed forms the checkpoint caught; comments and strings cannot be separated from code by a pattern."
    },
    {
      "option": "Parse with the typescript/unstable/sync project API",
      "reason": "It starts a compiler process through a virtual project; a token reader answers which specifiers a file loads without a type-checking session per call."
    },
    {
      "option": "Add a JavaScript parser dependency",
      "reason": "Criterion 19: no new dependency, and the scanner the repository already uses suffices."
    }
  ],
  "reopenWhen": "An edition --check passes after a registered source imports an unregistered runtime sibling through a form this reader misses."
}
```

## WO-157-D035

```json
{
  "id": "WO-157-D035",
  "date": "2026-09-23",
  "dispatch": "resume: fix; operator scope expansion (D030); WO-157 item 16 and criterion 20; adjacent-0002 (D024, FUP-c31c7bcab9270f49)",
  "decision": "State admission's finding rules in evidenceResultSchema with the keywords live transports already accept. When no criterion has a failing witness, `findings` has maxItems 0 and a verdict is `pass` or `unverified`. Otherwise a finding's criterionId names a criterion with a failing witness; findingId and free text are 1-2,000 characters; reproductionSteps, evidenceRefs and likelySurface hold 1-100 entries; evidenceRefs name subject evidence; and likelySurface names the failing criteria's code surfaces. As bounded adjacent repair of the same defect class, an evaluation's criterionId names a capsule criterion, its evidenceRefs name subject evidence (at most 100), and exemplarRefs and dissentRefs have maxItems 0, since admission refuses anything else. The prompt is unchanged.",
  "evidence": [
    "D024: on a subject with no failing witness the schema left findings free, admission can accept none, and claude-cli-print's --json-schema constrained the model only to the schema; D023's first live attempt refused as 'finding shape' (USD 1.90)",
    "Keywords: minItems, maxItems, minLength and maxLength are already used by live schemas (entropy-review-protocol.ts, plan-refutation-protocol.ts, mission-check-protocol.ts); `pattern` and `uniqueItems` appear in none, so they are not introduced",
    "Left to admission, asserted in the fixture: control characters and duplicate entries (schema-valid, refused by admission), and cross-field agreement, which JSON Schema cannot state here (a finding's surfaces within its own criterion, its evidence within its evaluation's, observed and expected from one witness)",
    "Fail before: docs/evidence/WO-157/fixtures/repair-fail-before-sweep.txt, item 16 — 'schema admits empty finding id'. Pass after: docs/evidence/WO-157/fixtures/repair-after.tap — the admitted demo result stays schema-valid; twelve shapes admission refuses (empty or over-long id, zero or 101 steps, no or unknown evidence, no, outside or absolute surface, unknown criterion, paraphrased observation, an exemplar reference) are each schema-invalid and refused; with no failing witness the schema admits no finding and no fail verdict, and an all-pass result stays valid",
    "Emitted schema for the feedback self-host subject, reconstructed from the recorded verifier stream (2 criteria, every witness pass): findings.maxItems 0, verdict ['pass', 'unverified']",
    "Changed existing expectations (criterion 17): verification.test.ts's legacy-profile step schema and verification-worktree.test.ts's clean observed and legacy step schemas now carry minLength 1 and maxLength 2000",
    "The repair's independent review compared the schema field by field with parseEvidenceResult and copyFinding and found it equal or looser everywhere, and ran a differential probe over the demo's verifier (3 criteria, 1 failing), repairer and re-verifier (2 criteria, none failing) plus edge variants (100 free-text steps, every surface, unverified with empty refs, a blocked result with empty arrays, a 2,000-unit astral findingId, a subject with no evidence): all admitted and schema-valid. Enums are deduplicated (the Claude CLI refuses duplicate enum items, WO-148 D009) and never empty",
    "Live, 2026-09-24 (D036): the re-mint's claude-cli-print verifier received this schema for the feedback self-host subject (2 criteria, every witness pass; findings.maxItems 0, verdict ['pass', 'unverified'], reconstructed from the recorded stream), accepted it and completed on the first attempt with no refusal"
  ],
  "rejected": [
    {
      "option": "Express control characters with `pattern`",
      "reason": "No live schema uses it; a transport that rejected the schema would cost a paid live attempt, and admission already refuses them."
    },
    {
      "option": "Per-criterion oneOf branches for cross-field agreement",
      "reason": "A larger schema of a kind no live transport has been shown to accept; admission keeps those rules."
    },
    {
      "option": "Leave the evaluation fields free",
      "reason": "They are the same defect class in the same schema, fixed in three lines inside the re-mint this repair already owes."
    }
  ],
  "reopenWhen": "A live verifier episode is refused with 'finding shape', 'evaluation shape' or another reason for a shape the schema admitted, or a live transport rejects the tightened schema.",
  "knownLimit": "Whether Codex's structured-output mode accepts `maxItems: 0` and bounds the size of the evidence and surface enums is not established in the repository; the live acceptance above is claude-cli-print's."
}
```

## WO-157-D036

```json
{
  "id": "WO-157-D036",
  "date": "2026-09-24",
  "dispatch": "resume: fix; WO-157 criterion 16 after the repair (the re-mint clause of D030 and the order's 2026-09-23 scope expansion)",
  "decision": "Re-mint every edition once more, after the repair's last registered-source edit, as new revisions selected in docs/evidence/current.json: authority WO-157 revision 002, artifact identity WO-157 revision 001, verification WO-157 revision 001, and feedback WO-157 revision 002 with one live claude-cli-print self-host episode (claude-sonnet-5 at xhigh, the D023 selection). The first WO-157 editions stay on disk as the record VER-001 judged.",
  "evidence": [
    "Registered sources the repair edited (evidenceSources(root)): packages/skeleton/src/source-change-worktree.ts, packages/skeleton/src/verification-protocol.ts and scripts/lib/evidence-sources.mjs (all five inventories) and packages/skeleton/src/loadouts/contributor.ts (authority, feedback, harness); source-change-worktree.ts and verification-protocol.ts are in FEEDBACK_SOURCE_PATHS. No registered source changed after the mint below",
    "Order of work, 2026-09-24: npm run build; harness emit and check --loadout contributor (31 surfaces); harness-context --check (every role within its ceiling); current.json repointed; authority --write and --check (from 14:07Z); evidence:artifact --write and --check; evidence:verification --write and --check; evidence:feedback --write; the live episode; feedback-evidence --record-selfhost and --check",
    "Why each edition changed, compared with its first WO-157 edition: authority.json is byte-identical and bundle-diff.json moves only role-bundle hashes (the Completion flags sentence, D033) and its revision label; artifact identity's four files and verification's four files are byte-identical (identity-only re-mints); feedback.json differs only in subject (sha256:503d9d6d... to sha256:a20f72f2...)",
    "Live episode, store .runtime/feedback-audit-wo157-r002, started 2026-09-24T14:07:55Z on Claude Code 2.1.280: complete on the first attempt (one WorkerAttemptStarted, no WorkerInterrupted), ten fixtures, 1,192 saved instruction bytes. Usage from the transport's result envelope (docs/control/local/process/usage.jsonl): 172,160 ms, 659,304 tokens (18,499 output), USD 1.5648478. Effective model and effort are unknown; the store records the host-launch selection",
    "The schema the verifier received, reconstructed from the recorded stream: 2 criteria, every witness pass, findings.maxItems 0, verdict ['pass', 'unverified'] (item 16, D035)",
    "feedback-evidence --check verified; the committed verification stream is 2,141,113 bytes with 169 WorkerHeartbeat events. evidence:console --record-current-selfhost, then --check: wo009, selfhost, control, refutations and missing match. harness-evidence: 31 current generated surfaces, historical smokes unchanged",
    "Item 12 and VER-001 F4 through the real edition check after the mint: docs/evidence/WO-157/fixtures/repair-item-12-after.tap, 3 of 3"
  ],
  "rejected": [
    {
      "option": "Keep the revision-001 editions selected because artifact identity and verification output did not change",
      "reason": "Criterion 16 requires a mint after the last registered-source edit, and the feedback subject moved, so validateSelfhost refuses the first streams."
    },
    {
      "option": "Overwrite the revision-001 editions",
      "reason": "Editions are immutable, and VER-001, D023, D024 and D029 cite the first ones (D030)."
    }
  ],
  "reopenWhen": "A registered source changes on this branch after this mint, or final review's integration finds a sibling edition selected in current.json."
}
```

## WO-157-D037

```json
{
  "id": "WO-157-D037",
  "date": "2026-09-24",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Judge the branch as it stands. `main` and `origin/main` are both at the order's base 64ab40de and the remote's newest tag is v0.44.0, so the review integrates nothing and the retained editions, component pins and application target v0.45.0 stand under the minor classification without a retime. The whole uncommitted subject was read against the order, VER-001, VER-002, decisions D001–D036, planning refutation 027 and the closeout map; four read-only review agents took the six seam groups, and every finding they raised was rechecked against source or reproduced in session scratch before it was recorded (D038–D040). Two committed transcripts had a per-user temporary-directory prefix replaced by `<tmpdir>`: docs/evidence/WO-157/fixtures/item-14-before.tap lines 17–20 and item-15-after.tap line 106; no other byte of any transcript changed. The reviewer composes the seam commits after the passing review, as D017 left to it, and publishes only the WO-157 branch and its pull request.",
  "evidence": [
    "git ls-remote origin refs/heads/main returned 64ab40de on 2026-09-24, the merge base of wo-157; git log HEAD..main and HEAD..origin/main are empty; git ls-remote --tags origin tops out at v0.44.0",
    "Tracked files match refs/dotln/checkpoint/WO-157/9 except the two projections the final-review dispatch regenerated (docs/control/current.md, docs/work-orders/README.md); the order text differs from its activation checkpoint only in the version label and the operator scope-expansion section D030 binds (git diff refs/dotln/checkpoint/WO-157/1 -- docs/work-orders/WO-157-closeout-followups.md)",
    "Refutation 027's nine known issues were judged against the landed bytes: eight reopening observations are not met (the base-clone sweeps record each fixture's own assertion; the race is fixed, not diagnosed; the default is the resolved id claude-sonnet-5; an unknown detail records as unclassified with the refusal written; an unreadable profile refuses by name; the Sort exemption is exact; every item decision names what it unblocks; DotLn never sets CLAUDE_EFFORT); the criterion-19 observation is met by D021's executor cold-start raise, which routes to the operator's reserved efficiency pass (WO-054 D006) that the order's non-goals name, so it is recorded and not re-dispatched",
    "The closeout map's eleven reopening conditions were checked against the landed fixes; none is observed on this branch (FINAL-001 §Criterion 18)",
    "Six committed files at HEAD carry the same /var/folders prefix; the item-14 transcript had already scrubbed the home directory to ~ and the race record uses <session-scratch>, so the placeholder keeps the transcripts consistent with the no-private-identifier rule"
  ],
  "rejected": [
    {
      "option": "Run npm run worktree -- integrate WO-157 anyway",
      "reason": "main has not moved since activation; the helper would checkpoint, stash and merge nothing, and the intake backup it requires would be made for no integration."
    },
    {
      "option": "Leave the temporary-directory prefix as HEAD precedent does",
      "reason": "The transcript already scrubbed one machine path; the edit is two lines, recorded here byte for byte, and removes a per-user identifier from the publication."
    }
  ],
  "goalAlignment": "Seeking the wrong goal would be marking integration done or a retime needed without an observation; both were read from the remote. Rule beating: the passing verifications were not taken as proof of the review agents' findings, which were each reproduced or read at source. NoOp on the transcripts would publish a per-user identifier the same record had elsewhere scrubbed.",
  "reopenWhen": "main moves before the pull request merges (the reviewer then integrates and retimes), or a scrubbed transcript is needed at its original bytes."
}
```

## WO-157-D038

```json
{
  "id": "WO-157-D038",
  "date": "2026-09-24",
  "dispatch": "resume: final review; item 4 and criterion 4; the review's reproduction of D005's claim",
  "decision": "Board up, not fix at review: target publication still runs one Git read in the target's own root that honours repository-level configuration a writer-controlled test can plant. `observeTarget` reads each branch commit's message with `git log -1 --format=%B <sha>` under the host's `core.hooksPath` and `core.fsmonitor` overrides only, so `log.showSignature=true` with `gpg.program=<path>` in the target's configuration makes that read execute the named program with the operator's privileges, after every refusal has passed and before the lane push. Criterion 4 holds as written (no planted hook runs; the guard is present) and D005's push route is sound (the lane reads none of the target's configuration), but D005's sentence that neither the target's hooks nor its repository configuration runs in the publish process is wider than the bytes. The same review found that the push-URL cross-check catches a planted rewrite but not a direct edit of `remote.origin.url` to another repository the operator can push to, because `ensureGh` resolves from the same configuration; that exposure predates WO-157 (WO-064) and the request binds only the local path. Both are recorded with one follow-up due at the deadline adjacent-0001 already carries, before WO-066's first target publication.",
  "evidence": [
    "Reproduced 2026-09-24 in session scratch on Git 2.55.0: a commit carrying a gpgsig header, repository configuration log.showSignature=true and gpg.program=/nonexistent/gpgprobe; `git -c core.hooksPath=/dev/null -c core.fsmonitor=false log -1 --format=%B <sha>` printed `fatal: cannot exec '/nonexistent/gpgprobe': No such file or directory` and still exited 0 with the message; adding `-c log.showSignature=false` made no exec attempt",
    "scripts/lib/target-publish.mjs line 400 is the only `git log` in the publication and source-change host paths (grep); the host's `git diff` passes --no-ext-diff --no-textconv, and rev-list, rev-parse and merge-base read no executable configuration",
    "docs/evidence/WO-157/writer-profile-probe.md shows the focused test run can write <common>/config, and a writer holding git.local can craft a commit with a signature header, so the path is reachable by writer-controlled code; it adds no privilege that code lacks at test time (D005's knownLimit), only a second execution moment at publish",
    "The fixture's positive control in scripts/test-target-publish.mjs shows only pre-push running on an ordinary push; reference-transaction, receivepack, sshCommand and the included fsmonitor have no positive control, so D005's 'the two hooks (shown to run on an ordinary push)' covers one",
    "The fixture moves the local-origin rewrite into GIT_CONFIG_GLOBAL, which confirms the lane ignores repository-level rewrites; a direct remote.origin.url edit is read identically by pushUrl (git config --get-all) and by resolveGitHubPushTarget (git remote get-url), so both agree and the gh check passes"
  ],
  "correction": {
    "misread": "D005 recorded that pushing from a fresh bare repository removes the whole class of configuration-driven code execution and that the configured push URL cannot be redirected.",
    "meant": "The push and its configuration reads happen in the lane; the earlier observation reads in the target root and the URL cross-check still trust the target's configuration.",
    "changed": "The claim is narrowed here, and the residual read and the URL binding are one named follow-up with its deadline."
  },
  "rejected": [
    {
      "option": "Add -c log.showSignature=false to the host overrides at review",
      "reason": "A one-line guard without a fixture is a claim the evidence cannot show; the fixture needs a commit carrying a signature header and a planted program, which is bounded repair work for an executor and an independent verifier, not reviewer cleanup, and no live target publication runs before WO-066."
    },
    {
      "option": "Fail the review to repair",
      "reason": "Criterion 4 holds as written, VER-002 passed, the root cause (writer-controlled test code reaching the common Git directory) is already boarded as adjacent-0001 with the same deadline, and the residual adds no privilege that code lacks during the episode; a repair, verification and review cycle for it is disproportionate."
    }
  ],
  "goalAlignment": "Correctness over sycophancy: a passing verification and a confident decision text were not taken as proof; the claim was reproduced and narrowed. Rule beating is why the guard is not added without its fixture. Shifting the burden: the follow-up names the fixture and the deadline so no reviewer rediscovers it at WO-066.",
  "followup": "Before WO-066's first target publication: make every host Git read in the target's root immune to its repository configuration, by adding log.showSignature=false (and neutralising gpg.program and gpg.ssh.program) to the publication's overrides or by reading the commit messages inside the publish lane after its fetch, with a fixture that plants log.showSignature and gpg.program on a branch commit carrying a signature header and asserts the program runs on an ordinary git log and not during publication; and bind the publication to the GitHub repository identity the request names, so an edited remote.origin.url is refused rather than pushed to.",
  "reopenWhen": "A target publication runs before that follow-up lands, or another host Git call in the target root is shown to execute repository configuration."
}
```

## WO-157-D039

```json
{
  "id": "WO-157-D039",
  "date": "2026-09-24",
  "dispatch": "resume: final review; item 1 and criterion 1; the review's reading of D002",
  "decision": "Board up a crash window outside criterion 1's stated cases. After `git stash push` succeeds, the receipt on disk still reads stage `preserved` with `stash: null` until the next save; a process killed in that window leaves a clean tree and a named stash, and `--continue` then finds nothing dirty, merges and completes without applying the stash, which stays retained under the integration's name. The pre-stash cases the order names hold, and a stored-then-failed stash resumes as D002 says; D002's sentence that saving the receipt first keeps every crash point recoverable is wider than the bytes for this window. Not a regression: the helper at the base had the same window.",
  "evidence": [
    "scripts/lib/worktree-integration.mjs preserveAndMerge: the receipt is saved at stage preserved with stash null before the push; `receipt.stash = created` and the stage-merging save follow the push; on --continue a preserved receipt re-enters preserveAndMerge, skips the stash block when the tree is clean, and the later `if (receipt.stash)` apply is skipped (read 2026-09-24)",
    "ownStash(seen) already identifies a stash entry carrying this integration's name and base commit, so a continuation on a clean tree with stash null can adopt it before merging",
    "The window is the interval between the push's exit and the following save; the work is preserved in the stash and the receipt records the stash name, so recovery by hand is possible"
  ],
  "correction": {
    "misread": "D002 said saving first and removing the receipt only when nothing was stashed keeps every crash point recoverable.",
    "meant": "Every pre-stash failure is recoverable by a fresh run, and a stored-then-failed stash by --continue.",
    "changed": "The post-push, pre-save crash is named here with its follow-up."
  },
  "rejected": [
    {
      "option": "Adopt the own stash at --continue now",
      "reason": "A recovery-logic change and its fixture at review would ship without independent verification; the window is narrow, pre-existing and leaves the work preserved."
    }
  ],
  "followup": "Make `worktree integrate --continue` adopt the integration's own stash entry (its stash name and base commit, as ownStash identifies it) when the tree is clean and the preserved receipt records no stash, before merging, with a fixture that writes such a receipt beside a stored stash and asserts the work is re-applied and the receipt names the stash.",
  "reopenWhen": "An integration completes with its branch's uncommitted work only in git stash list, or the receipt format changes."
}
```

## WO-157-D040

```json
{
  "id": "WO-157-D040",
  "date": "2026-09-24",
  "dispatch": "resume: final review; items 6, 11, 12 and 15; the review's rechecks of D007, D016, D033 and D034",
  "decision": "Record four minor limits the review found, one with a follow-up. (1) `resident-bind --check` compiles a portfolio store under the bound repository's registered profile but never compares the binding record's `profileId` with that profile's `authorityEnvelopeId`, so a store whose record names a stale or hand-edited profile id passes and the check prints that name; criterion 6 holds because the compiled check is against the real profile. (2) The item 11 refusal keys on the literal harness name `claude-code`; another spelling under a readable CLAUDE_EFFORT records with only the discovery advisory, as D033's review noted. (3) The import reader also counts an indexed-access import type, `import(\"x\")[\"v\"]`, as a runtime import, which errs toward refusing, the same class as D034's `typeof import`. (4) D016's reason for rejecting `gc.auto=0` is unsupported: on Git 2.55.0 that setting also stops the detached maintenance child; the landed `maintenance.auto=false` is the direct control and stands.",
  "evidence": [
    "scripts/resident-bind.mjs: profileId is written at bind (line 650) and printed by the check (line 665); portfolioMismatches (line 675) references no authorityEnvelopeId (grep 2026-09-24); the review agent reproduced a loader-built store whose record says profileId 'not.the.profile' returning no mismatch",
    "scripts/resume.mjs parseActor compares harness === 'claude-code' literally (lines 508–526)",
    "The review agent probed relativeImports with thirteen forms in a temporary directory; `type Q = import('./g.mjs')['v']` is counted and no realistic runtime form is missed",
    "Reproduced 2026-09-24 in session scratch on Git 2.55.0 with two loose objects under objects/17 before a commit: GIT_TRACE2_EVENT shows six maintenance child events with no configuration, none with gc.auto=0 and none with maintenance.auto=false"
  ],
  "rejected": [
    {
      "option": "Fix the profileId comparison at review",
      "reason": "A one-line comparison and a fixture in resident-bind's suite is small, but the review changes no runtime or helper source without independent verification; it is named for the next order that touches resident-bind."
    }
  ],
  "followup": "In the next order that edits scripts/resident-bind.mjs: make --check compare the binding record's profileId with the registered profile's authorityEnvelopeId and name a mismatch, with a fixture whose record carries a stale profile id.",
  "reopenWhen": "A portfolio store passes --check while its record names a profile other than the one it was checked under, or a harness spelling other than claude-code records a Claude Code completion."
}
```
