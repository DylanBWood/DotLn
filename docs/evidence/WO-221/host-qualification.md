# WO-221 host qualification

Criterion 4 asks for one bounded episode per host, launched by the operator as
WO-146's were: a scratch launchpad exported from this branch, registered
against a scratch GitHub repository under the operator's account, running a
target order from `worktree start` through the draft form at `verified` and
the publish at `closed`, with no operator approval and no edit to user
settings. The executor cannot launch them (they spend the operator's credits
and need the operator's host sessions), so each row below is `blocked` with
the launch command the operator runs; a row is rewritten from the episode's
observations when it has run. The scratch launchpad and repository are named
only as scratch.

## Preparation (once, from this worktree, after the kit builds)

```sh
node scripts/launchpad.mjs export <tmp>/dotln-wo221-scratch
cd <tmp>/dotln-wo221-scratch && git add -A && git commit -qm "Scratch launchpad for the WO-221 qualification" && npm ci
```

Then, in the scratch launchpad: create an empty scratch repository under the
operator's GitHub account and clone it; register it in `dotln.config.json`
(`repositories.scratch` with `baseBranch`, `worktreeParent`, a class, an
authority profile allowing `repo.read`, `repo.write`, `repo.test`,
`repo.push` and `pr.open`, a `gate`, and `hostRules` absent); add the operator
grant for `scratch` to `packages/skeleton/loadouts/grants.json`; commit both on
`main`; run `npm run worktree -- clone scratch <absolute clone path>`; write a
one-criterion target order `docs/work-orders/WO-001-*.md` with
`**Repository:** scratch @ <base commit>`; run
`npm run worktree -- start WO-001 docs/work-orders/<file>.md`.

## Rows

| Host | Version | Mode | Outcome | Commands and what carried them | Denials |
| --- | --- | --- | --- | --- | --- |
| Claude Code | 2.1.304 (the fork's attestation of every WO-005 phase and `claude --version` on 2026-10-20) | auto mode on, with the operator's two interim `autoMode.environment` entries of 2026-10-18 present and the fork launchpad's untracked `.claude/settings.local.json` allowing `Bash(node *)` and `Bash(gh pr create:*)` among others; `hostRules` absent from the registration | run on 2026-10-20 in the operator's instance (its WO-005 against DotLn-Angular, starter v0.85.0), rewritten from the fork's planning document of 2026-10-20 §11 by the 2026-10-20 fork-answers pass: the hook's own decision observed; the host's behavior without the entries unobserved; the kit's final publish refused by its own lint; the close carried by the host | Draft at `verified`, 15:44:58Z: `npm run worktree -- publish WO-005 --target-worktree --draft --branch feat/foundation-libraries --title <the order's title> --body-file <the committed body>`, run by the session that recorded VER-001 pass. The journal's PreToolUse row classed the effect `lifecycle.run` and allowed it; no `registeredTargetAdmission` row exists in any journal of the instance (at v0.85.0 the npm spelling matched no helper shape; since v0.87.0 it is withheld with the node spelling named). No prompt observed: printed and finished within eight seconds. Draft pull request DylanBWood/DotLn-Angular#3 at 15:45:04Z. Closed-phase publish: the kit's `worktree publish WO-005 --target-worktree` refused at the outward lint before any push (a 90-character commit subject against the 72-character limit), so the second publish did not run through the kit; the operator chose the hand route (the pull-request edit and the ready step succeeded; the session pushed the reviewed series from the target worktree under the lease); #3 merged at 16:55:22Z. Close: `resume: release close` at 16:57Z, outcome no-release; the journal at 16:57:11Z: `Release-close admission withheld: byte-exact helper spelling missing; host permissions decide.`, so the host carried the command, as at WO-011's close (13:50:33Z) and WO-001's (2026-10-15). The base checkout lost nothing (it held no ignored file); the target worktree lost `.nx` (119 files), `dist` (10) and `node_modules` (37,877). | none: no `HostPermissionDenied` row in the episode. Standing after the episode: the operator removed the two user-settings entries and the launchpad's `Bash(node *)` allow on 2026-10-20 at the end of the fork's planning pass (absent when the 2026-10-20 fork-answers pass read the two files, patterns only); no lifecycle command has run since; the fork's WO-006 draft publish under v0.87.0's node spelling is the first observation of the host after a hook admission alone, and this row is rewritten from it. |
| Codex | not run (blocked) | Auto (workspace-write, on-request approvals, network off) | blocked: launch not run by handoff | Launch: `codex --add-dir <target worktree>` in the order worktree (the printed line); same phrases and publish forms as above. With the project `.codex/` layer trusted, the generated `.codex/rules/dotln-WO-001.rules` (written only under `hostRules: "literal"`) carries the push and `gh pr` forms; without it, record each approval prompt. | none observed yet |
| Copilot CLI | not run (blocked) | default | blocked: launch not run by handoff | Launch: `copilot` with the printed `--allow-tool` lines from `worktree start` in the order worktree; same phrases. The shared hook admits the commands through the registration; record each approval prompt. | none observed yet |

## Known issues

- The Claude Code row's episode (the fork's WO-005, 2026-10-20) observed the
  hook's decision only: the operator's interim trust entries and a
  `Bash(node *)` allow admitted the same commands regardless of the hook.
  They were removed afterwards, so the fork's WO-006 draft publish is the
  episode that decides whether the classifier still asks after the hook's
  `allow`; the fallback exists for a `no`.
- Whether a hook's `allow` pre-empts the Claude Code auto-mode classifier is
  unstated in the published documentation (planning document §3); this
  branch's own execution observed the classifier deny this executor's edits
  and build of the hook host as self-modification before auto mode was
  exited, which is a different judgment from the target push the episode
  tests. The episode decides it; the fallback exists for a `no`.
- The fallback's Codex rules live in `.codex/rules/dotln-WO-NNN.rules`
  (Starlark `prefix_rule`), not in `config.toml`: the public Codex rules
  page describes prefix rules as Starlark in `.rules` files under a trusted
  layer's `rules/` directory, and `config.toml` carries no such table
  (decision D002).
