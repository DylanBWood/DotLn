# A fork's own pull requests open on the fork, not its parent

A session in a fork no longer has to spell `git push` and `gh pr create` for the launchpad's own branches, and where it still spells `gh`, the hook stops the forms that would silently land on the parent repository. This closes the incident behind the order: on 2026-10-30 a fork's update pull request was opened on the starter it was forked from, because `gh` resolves a clone with an `upstream` remote to that parent unless a default was set.

## What changes

**One publish helper with two doors.** `node scripts/refute-plan.mjs publish --title <title> --body-file <path>` ends a planning pass and `node scripts/launchpad.mjs update --publish --title <title> --body-file <path>` publishes an instance's update branch. Both lint the title and body, refuse AI attribution, prove `gh` and its login for the repository origin's push URL names, push the branch there and open a ready pull request with `--repo`. Every refusal comes before the first push. After a failed create, a retry pushes nothing again and adopts the open pull request whose head, branch and base match. `plan publish` needs a `planning/<date>-<slug>` branch with its planning document committed; `update --publish` needs a `chore/<slug>` branch whose provenance files name a kit commit `main` does not, with the re-emit and lineage index committed.

**A ninth hook refusal.** In a clone whose `origin` and `upstream` name different repositories and whose gh default is unset, a `gh pr` or `gh issue` command that names no repository is refused, naming `-R <origin>`. It is admitted with `-R` or `--repo`, with `GH_REPO=` in the command, with a pull-request or issue URL, once `gh repo set-default` has run, and in a clone with one remote. Two remotes are one repository only when host, owner and name all match. A clone whose remotes cannot be read is admitted with one advisory.

**Pull-request titles in the form core writes.** A title may be a gitmoji and a subject with no conventional type, and titles have no length limit. Commit subjects keep the conventional type and the 72-character limit. The target publish lints its title as a title only.

**A fetch that borrows the checkout's objects and has a bound.** `update --finish`, the target close and the target publish read the remote's commit first, fetch nothing when the checkout already holds it, and otherwise download only what is missing. The read and the fetch share one ten-minute bound; past it the command refuses with the checkout unchanged and prints the by-hand route. `update --finish` takes `--fetch-timeout <seconds>`. On this repository the executor measured a plain lane's fetch at 2.5 s holding 49 MB, and the borrowing lane's at 57 ms holding none ([decision](../../evidence/WO-246/decisions.md#wo-246-d005--the-lane-borrows-the-checkouts-objects-and-the-import-stops-where-the-checkouts-refs-do)).

## Read before merging

**This change widens what a session may run without a prompt.** The emitted `.claude/settings.json` gains its first `permissions.allow` entries: `Bash(node scripts/launchpad.mjs update --publish *)` and `Bash(node scripts/refute-plan.mjs publish *)`. They let a session push a planning or update branch and open its pull request without a host prompt, and by the host's auto-mode page before its classifier. No rule names `git push` or `gh`, and the deny list is unchanged. The executor first parked this edit when the host classifier denied it as self-modification, and made it after the operator chose the rules in that session ([decision](../../evidence/WO-246/decisions.md#wo-246-d010--the-operator-authorizes-the-two-allow-rules)). That the host treats these two rules as narrow is an inference from its documentation; no live classifier was exercised.

**One existing behavior tightens.** The attribution check now reads each line past a leading gitmoji, in either form, so `:robot: Generated with …` no longer slips past it. A line that opens with a gitmoji and then a session key such as `user-session:` is refused where `main` admitted it; the same line without the gitmoji was already refused.

**A fork is still exposed until it takes this release.** Running `gh repo set-default origin` once in the fork's clone closes the gap today.

## Validation

`npm test -- --review` passed at the reviewed code identity: 44 suites, none unrun, 0 h 38 min. The first verification failed on one finding: two remotes with the same owner and name on different hosts were read as one repository. The repair made the host part of a repository's identity, and its own review caught and fixed two more defects before the complete run. The second verification passed, and the final review reproduced the repaired finding with the first verification's own probe, ran the second's probe and the seven focused cases, and read the whole source diff. Integration took in nothing, because `main` had not moved.

The final review found one defect and boarded it without fixing: the attribution pattern holds three invisible literal characters where the lint's copy uses escapes. It changes no behavior today, and fixing it would have cost a fresh complete run ([decision](../../evidence/WO-246/decisions.md#wo-246-d030--final-review-f1-the-attribution-pattern-holds-invisible-characters)).

## Limits

- Both doors were tested against a gh double and a local bare repository. No real pull request has been opened through them.
- The refusal judges the command as written. A script that calls `gh`, a remote named `github`, and some shell forms are outside it, and Codex and Copilot tool calls are not hooked, so under them the rule is role text.
- A fork on an SSH alias of `github.com` is refused by the helper's gh preflight before any push; a follow-up carries it.
- The ten-minute bound has no override on the target close and target publish. Their refusal names `git fetch origin <base>` in the clone, after which the retry finds the commit held.
- Every role's startup text grows by 140 bytes and the planner's by 359, over ceilings that were already exceeded; the optimization is boarded, with no ceiling raised.

Evidence: the [final review](FINAL-001.md), [VER-001](../../verifications/WO-246/VER-001.md), [VER-002](../../verifications/WO-246/VER-002.md), the [handoff](../../evidence/WO-246/handoff.md) and the [decisions](../../evidence/WO-246/decisions.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-11-05T14:33:52.849Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Dispatch | Wall clock | Tokens | USD | Commands | Steps | Bound stops | Bound acceptances |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-246/executor | 5 h 43 min | 130,792,051 | unknown | 626 | 936 | 0 | 0 |
| WO-246/verifier | 0 h 37 min | 17,691,546 | unknown | unknown | unknown | 0 | 0 |
| WO-246/reviewer | 0 h 16 min | 17,110,215 | unknown | 70 | 97 | 0 | 0 |
| WO-246/release-close | unknown | unknown | unknown | unknown | unknown | 0 | 0 |
| WO-246/planner | unknown | unknown | unknown | unknown | unknown | 0 | 0 |
| WO-246/refuter | unknown | unknown | unknown | unknown | unknown | 0 | 0 |
| WO-246/router | unknown | unknown | unknown | unknown | unknown | 0 | 0 |

Against WO-254, the previous closed order: wall clock 0 h 50 min less.

Against WO-254, the previous closed order: tokens 315,583,980 fewer.

Against WO-254, the previous closed order: commands 192 fewer.

Against WO-254, the previous closed order: steps 114 fewer.

Against WO-254, the previous closed order: bound stops unchanged (0 difference).

Against WO-254, the previous closed order: bound acceptances unchanged (0 difference).

<!-- dotln-process-meter:end -->
