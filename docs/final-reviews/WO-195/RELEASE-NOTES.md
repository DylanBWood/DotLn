## Release overview

This release lets the two roles that end a cycle finish what the operator dispatched. A Claude `resume: release close` now runs from publication to a removed worktree and a deleted branch in one session, so the operator no longer runs the command themselves. In 6 of the 12 Claude closes recorded from 2026-10-01 to 2026-10-03 the operator had to step in. In 5 the auto-mode classifier denied the publish and the operator ran it with `!`. In one, cleanup stopped partway and the operator removed the directory and re-ran the command. A planning pass now ends with its branch pushed and its `:memo:` pull request open. The visible changes:
- After a merge leaves main's runtime stale, the release-close prompt rebuilds it and records the dispatch, so the exact helper is admitted.
- `release close` prints a short summary and keeps its full output in a retained report.
- Cleanup removes sealed directories and leftovers Git has already dropped, and deletes the merged branch in the same run.

The release is for operators and agents who run `resume: release close` or a planning pass.

## Read before upgrading

- **The prompt hook can take longer.** On a stale main, the `resume: release close` prompt runs `npm run build` and `harness emit` before it records the dispatch. Each step has a 120 s bound and the hook replay 30 s, so `.claude/hooks/session.mjs` now has a 600 s timeout on prompt submission. Every other hook keeps 15 s. The rebuild is withheld while a writer reservation or a live gate holds main, and the advisory names the fact that stopped it.
- **Admission is unchanged in what it requires.** DotLn still admits only the byte-exact helper, with canonical material words, after this session records that order's release-close dispatch, with main as the working directory and canonical status listing `release-close`. A redirected, prefixed or piped spelling is not admitted. When the exact helper carries an added redirect or pipe, it now gets an advisory that the byte-exact spelling is missing instead of silence. A missing dispatch, working directory or legal action is named the same way. A typed correction withholds admission. No allow rule is added.
- **Standard output is a summary.** `release close` prints the outcome, tag, Release, each cleanup row, each open blocker with its retry command, and the path of the full report under `docs/control/local/retained/WO-NNN/`. Anything that read the old output must read that report.
- **Cleanup acts on more of the subject.** After preservation verifies, the close records a removal receipt and restores write permission on owned directories inside the subject. It follows no symbolic link and changes nothing outside the subject. A directory Git has unregistered is removed only after its receipt verifies, no worktree is registered there, and no writer or gate holds it. Otherwise a blocker names the path.
- **A blocked close keeps its writer.** When cleanup is blocked, the dispatched session keeps main's writer reservation so that it can finish the retry. A successful close releases it.
- **Role text changed.** The release-close role states when the close is done, says to finish a blocker in the session and re-run the same command as the retry, and says to retry a host denial once before handing the operator the command for `!`. The planner pushes its planning branch and opens its `:memo:` pull request after the refutation receipt is filed and `npm run test:docs` passes. It never merges.
- **Component versions.** The compiler moves 0.25.0 → 0.25.1 and the skeleton 0.52.1 → 0.52.2, and the console pins the skeleton exactly. No dependency is added.

## Substantive changes

**Release-close admission after a merge.** A merge that changes the pinned runtime used to leave the prompt hook in its generated fallback, which recorded no dispatch, so the admission WO-178 added never fired. That happened in 5 of the 9 closes since it landed. The fallback now recovers only the exact prompt `resume: release close`, in main, when canonical status lists `release-close`. It rebuilds and re-emits the runtime under the writer lock, then replays the normal hook once. The normal hook records the dispatch and judges admission, so no second evaluator exists. The other 4 closes missed admission because the session wrapped the command, and the new short output removes the reason to wrap it.

**One printed command.** One exported builder spells the helper for the resume briefing, the `worktree publish` handoff, the material command and every blocker retry. The bare `node` spelling the admission refused is gone from the helper's output. The publish handoff now says to start a session in main and run the command exactly, with no `cd` line.

**Short output, full record.** The close writes every line it used to print, including the runtime-refresh line of a no-release close, to a timestamped report beside `release-close.json`. Standard output carries only the summary, which ends with that report's path.

**Cleanup that completes.** Directories that verification sealed at mode `0500` no longer stop `git worktree remove`. A subject directory still on disk is never recorded `removed`. When Git has dropped the worktree but the directory remains, the same run, or a re-run, removes it once the retained receipt for that path verifies its snapshot and preserved destinations. Restricted beacon directories are opened for that check, and their modes are restored. Without readable close history, the order's receipts still name candidate paths, and the branch stays until each is gone. A retry follows each path's latest outcome and clears only blockers bound to the path it removed. The merged branch is deleted in the run that removes the worktree, and a dry run prints `would-delete`.

## Progressive polish

Product 07 §Workflow closeout and releases states the completion condition, the retry and the removal rules, and §Operator-opened planning pass states that the pass pushes and opens its pull request. The auto-mode row of `docs/AI-HARNESS-SECURITY.md` states when the admission applies. New fixtures cover the stale main checkout, each printer's admission, sealed and leftover directories, restricted beacons, multiple-path retries, missing close history and the no-release refresh line. The test runner declares the new and changed close-path sources as machinery inputs.

## Evidence and compatibility

Application `v0.66.2` is a patch release over `v0.66.1`, built from WO-195 on `main` at `72bc3ab3`. The compiler moves 0.25.0 → 0.25.1 and the skeleton 0.52.1 → 0.52.2. Kernel and console sources are unchanged. The console's exact pin and its regenerated expected fixtures move, and no dependency was added.

The verification sequence:
- [VER-001](../../verifications/WO-195/VER-001.md) failed on criterion 3: a no-release close with a stale runtime printed one line its retained report lacked. It also sent three cleanup findings to the repair: restricted beacon directories, retry bookkeeping and a leftover no record named.
- [VER-002](../../verifications/WO-195/VER-002.md) passed after the repair, which also integrated `main` at `72bc3ab3` under the operator's scope expansion.
- [FINAL-001](FINAL-001.md) passed.

A fresh `npm test -- --review` at the reviewed subject passed 41 of 41 suites with 91 fresh tasks in 860 s, and `npm run test:docs` passes. The fixtures for criteria 1, 2 and 4 fail against `efe62994`, the base the order was planned on.

Known limitations:
- No live Claude close, classifier admission or real rebuild inside the hook bounds ran within the order. This order's own close from merged `main` is the first live observation.
- A retry after `origin/main` moves still refuses at the existing-Release check (FUP-da471832071118c7).
- A truncated removal receipt that no close history names fails closed with a cleanup blocker whose reason does not name the file.
- Ignored runtime output beside a declared material path is not inventoried.
- Codex has no auto-mode classifier. The two role sentences apply in both harnesses unchanged.

Details are in the [decisions](../../evidence/WO-195/decisions.md) and the [handoff](../../evidence/WO-195/handoff.md).
