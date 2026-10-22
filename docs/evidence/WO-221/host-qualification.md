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
| Claude Code | 2.1.304 (the fork's WO-005, 2026-10-20) and 2.1.306 (the fork's WO-006, 2026-10-21), both from the fork's attestations | auto mode on. WO-005: the operator's two interim `autoMode.environment` entries of 2026-10-18 and the fork launchpad's untracked `.claude/settings.local.json` allows for `Bash(node *)` and `Bash(gh pr create:*)` present. WO-006: all three removed on 2026-10-20 (both settings files read by pattern on 2026-10-20 and 2026-10-21, zero matches). `hostRules` absent from the registration both times | WO-005 (starter v0.85.0): the hook made no decision at all (at v0.85.0 an `effect: lifecycle.run, allowed: true` row means the hook returned `{}`, `packages/skeleton/src/harness-host.ts` at that tag, lines 5412 to 5417), so the host's own permission flow carried the draft under the interim entries; the 2026-10-20 rewrite's phrase "the hook's own decision observed" overstated it (corrected by the 2026-10-21 pass). WO-006 (starter v0.88.0, kit `a54f8d65`), rewritten by the 2026-10-21 pass from the fork's `docs/evidence/WO-006/host-qualification.md`: no registered-target admission was granted at any publish, so whether a hook `allow` pre-empts the classifier is still unobserved. What was observed is the classifier with no hook decision: two denials at `verified`, one allow at `closed`, cause of the difference unobserved | Draft at `verified` (VER-001 session, `claude-opus-5-5` xhigh): first attempt at 14:49:53Z ran `node scripts/worktree.mjs publish WO-006 --target-worktree --draft …` with a `2>&1 \| tail -20` suffix; the hook's plain-word parser declines a piped command, so no admission row and no advisory were written, and the classifier denied without a prompt (`HostPermissionDenied`, rule `[Unrequested Commit in a Connected App]`). Second attempt at 14:53:09Z, the plain spelling: the admission evaluated and was withheld, `publication authority differs from main's committed dotln.config.json` (the order worktree's registration adds the `visual` gate command, a plugin flag and a diagnostic path, and the admission compares whole-file bytes); the classifier denied without a prompt, rule `[Create Public Surface]`; a following read-only journal check was denied, rule `[Out-of-Place Publication]`. The operator then ran the same command with the `!` prefix: the kit's outward lint refused it (`vocabulary.launchpad` on the generated Change table, which names a fixture `launchpad-board-2026-10-21.json`); after the operator set the instance's `terms` to one placeholder in `main`'s working copy, the `!` run pushed the draft and opened DylanBWood/DotLn-Angular#4 at `a9e58af4` (a `!` run bypasses the hook and the classifier alike). Publish at `closed` (FINAL-001 session, `claude-fable-5-1` xhigh, 16:50:57Z): `cd <order worktree> && DOTLN_LAUNCHPAD=… node … publish WO-006 --target-worktree …`, the directory change and the variable in front of the node spelling, so the parser did not read the helper form and no admission row exists; the classifier allowed without a prompt; #4 marked ready at `5eee5951`. Close of the instance's WO-012 (04:03Z to 04:07Z): the printed helper form ran three times (dry run, publish, idempotent retry); the session's first `resume: release close` prompt was withheld at `snapshot-missing` because `node scripts/bootstrap.mjs` had not run on the fast-forwarded `main` (WO-226). | `HostPermissionDenied` rows in WO-006: two at the draft (`[Unrequested Commit in a Connected App]`, `[Create Public Surface]`) and one on a read-only journal check (`[Out-of-Place Publication]`); none at the closed-phase publish; one after WO-012's close at 04:08:15Z on a 212-byte Bash input whose command the fork's record does not hold. |
| Codex | not run (blocked) | Auto (workspace-write, on-request approvals, network off) | blocked: launch not run by handoff | Launch: `codex --add-dir <target worktree>` in the order worktree (the printed line); same phrases and publish forms as above. With the project `.codex/` layer trusted, the generated `.codex/rules/dotln-WO-001.rules` (written only under `hostRules: "literal"`) carries the push and `gh pr` forms; without it, record each approval prompt. | none observed yet |
| Copilot CLI | not run (blocked) | default | blocked: launch not run by handoff | Launch: `copilot` with the printed `--allow-tool` lines from `worktree start` in the order worktree; same phrases. The shared hook admits the commands through the registration; record each approval prompt. | none observed yet |

## Known issues

- The removal of the operator's interim entries and the launchpad-local
  allows before the fork's WO-006 was core's framing of the qualification
  test (the 2026-10-19 fork-requests pass: with the entries present a
  prompt that does not appear proves nothing about the hook). That framing
  rested on WO-178's 2026-09-30 reading of the host documentation, which no
  current page supports (a research pass of 2026-10-21 over the hooks,
  permissions, permission-modes and auto-mode pages found no sentence on a
  hook `allow` against the classifier), and on a WO-005 observation that
  was a hook no-decision. With the entries gone the publish stopped: the
  admission withheld and the classifier denied, and the operator carried
  the publish by hand. Until a live episode records the admission's `allow`
  and the classifier's verdict together, the kit's own route is the
  registration's `hostRules: "literal"` fallback (WO-221 criterion 2),
  which writes the order's exact rules into the launchpad's
  `.claude/settings.local.json` at `worktree start` and removes them at
  release close; whether auto mode keeps a rule that begins with the node
  path is undocumented and is that order's first observation.
- The Claude Code row's first episode (the fork's WO-005, 2026-10-20)
  observed the hook's decision only: the operator's interim trust entries
  and a `Bash(node *)` allow admitted the same commands regardless of the
  hook. The second episode (the fork's WO-006, 2026-10-21, entries absent)
  did not decide whether the classifier yields to a hook `allow`, because
  no admission was granted: one spelling was piped and went unparsed, the
  plain spelling was withheld on whole-file equality of `dotln.config.json`
  with `main`, and the closed-phase spelling carried a directory change and
  a variable in front of the helper. WO-226 narrows the equality to the
  registration's publication fields and configured roots, retaining the
  committed grants' byte equality. A helper hidden by a pipe, redirect or
  prefix now journals `registeredTargetAdmission: { kind: "near-miss",
  syntax }` and prints an advisory without making a permission decision.
  These kit-side changes leave the classifier unqualified.
  The next admitted publish in the fork with the entries absent
  decides the question, and the fallback exists for a `no`.
- Whether a hook's `allow` pre-empts the Claude Code auto-mode classifier is
  unstated in the published documentation (planning document §3); this
  branch's own execution observed the classifier deny this executor's edits
  and build of the hook host as self-modification before auto mode was
  exited, which is a different judgment from the target push the episode
  tests. The WO-006 episode adds the classifier's own record with no hook
  decision: two denials at `verified` without a prompt and one allow at
  `closed` without a prompt, for the same helper on the same host and
  settings; the fallback exists for a `no`.
- The fallback's Codex rules live in `.codex/rules/dotln-WO-NNN.rules`
  (Starlark `prefix_rule`), not in `config.toml`: the public Codex rules
  page describes prefix rules as Starlark in `.rules` files under a trusted
  layer's `rules/` directory, and `config.toml` carries no such table
  (decision D002).
