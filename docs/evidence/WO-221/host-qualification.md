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
| Claude Code | not run (blocked) | auto mode (the host's default restrictive mode) | blocked: launch not run by handoff | Launch: open `claude` in the order worktree printed by `worktree start`; enter `resume: next`, then `resume: verify`; at `verified` enter `npm run worktree -- publish WO-001 --target-worktree --draft --branch feat/scratch --title "feat: scratch" --body-file <body>`; then `resume: final review` and the closed-phase publish of the same branch; then `resume: release close` in the scratch main. Record whether the hook's second admission carried each command (journal rows `registeredTargetAdmission`) or the classifier still asked; if it asked, set `hostRules: "literal"` in the registration, rerun `worktree start` for a fresh order and record which literal rule carried it. | none observed yet |
| Codex | not run (blocked) | Auto (workspace-write, on-request approvals, network off) | blocked: launch not run by handoff | Launch: `codex --add-dir <target worktree>` in the order worktree (the printed line); same phrases and publish forms as above. With the project `.codex/` layer trusted, the generated `.codex/rules/dotln-WO-001.rules` (written only under `hostRules: "literal"`) carries the push and `gh pr` forms; without it, record each approval prompt. | none observed yet |
| Copilot CLI | not run (blocked) | default | blocked: launch not run by handoff | Launch: `copilot` with the printed `--allow-tool` lines from `worktree start` in the order worktree; same phrases. The shared hook admits the commands through the registration; record each approval prompt. | none observed yet |

## Known issues

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
