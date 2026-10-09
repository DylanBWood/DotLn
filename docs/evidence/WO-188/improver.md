# WO-188 self-review: improver of design, simplicity and maintainability

A fresh `dotln-worker` agent, spawned read-only before `implementation-ready`
on 2026-10-08 with only the order and the diff against 28d32e26, and asked for
concrete improvements. Its report follows verbatim; the executor's disposition
of each finding is at the end and in the handoff. Paths in the report are
repository-relative. The agent ran two probes in the session scratchpad,
outside the repository.

## Report

WO-188 improver pass (design, simplicity, maintainability). Read-only. I read the order, the diff against 28d32e26 and the three new untracked files. Two items were checked by running something:

- I ran `inventoryMaterial` and `removeScratchRepositories` against a throwaway repository in the session scratchpad, before the executor's gate started.
- I ran a Git 2.55 fsmonitor experiment in the same scratchpad.

After the executor's live gate started, the harness refused `node -e`, so finding 15's regex claim comes from reading the code.

1. **`scripts/lib/worktree-material.mjs:271-311`, with `scripts/worktree.mjs:60-66`**
   - **What is wrong:** `removeScratchRepositories` throws on the first repository it cannot remove. Repositories it already removed earlier in the same list are gone, and their records (path, head, remoteHeld) are lost with the throw. `removeScratch` only prints rows after the whole list returns.
   - **Evidence:** In the scratchpad, `scratch/a` and `scratch/b` were nested repositories with `b` set to mode 0555. The call returned no rows, threw `Scratch repository "scratch/b" could not be removed ...; source retained`, and `a` no longer existed. The fixture at `scripts/test-process-debt.mjs:10993-11009` hides this. Its comment says "names itself and leaves the rest", but it calls `inventoryMaterial(from)` without the preserve word, so `scratch-material/kept` sorts first and is silently deleted before the throw. The docstring at `:268` ("leaves it whole beside the others") is also false.
   - **Why it matters:** Item 1 requires every removal to be recorded with its head commit. On the derived-worktree settle path no preview is printed, so the removed repository's commit becomes unrecoverable and unnamed.
   - **Change:** Use two passes. First run `prepare` and `unwritableDirectory` for every disposable row, and throw before any `rmSync`. Then remove each row and hand it out as it lands through an `onRemoved(row)` option that `removeScratch` uses to print its `Scratch removal:` line. Change the test to keep the word, or to assert that `kept` survives the refusal.
   - **Severity:** should-fix.

2. **`scripts/lib/intake-reconciliation.mjs:333`**
   - **What is wrong:** The dry-run preview calls `removeScratchRepositories(source, material, { dryRun })`. The real removal uses `scratchMaterial(receipt)` (`:364`), which also includes repositories that the walk found but Git could not list.
   - **Why it matters:** The preview, and the close record built from it, omit repositories the close then deletes, even though the comment at the end of `reconcile` says "the preview above says what would go".
   - **Change:** `receipt.removals = removeScratchRepositories(source, scratchMaterial(receipt), { dryRun });`
   - **Severity:** should-fix.

3. **`scripts/release.mjs:1980-1983`, with `scripts/test-release.sh:1282`**
   - **What is wrong:** `materialCaused` matches `submodule`. A submodule refusal therefore gets a `--material <path>=preserve` / `=disposable` command and a printed `Material retry:` line whenever any retained worktree has material rows.
   - **Why it matters:** That command cannot clear the blocker. A gitlink is never a material row, `inventoryMaterial` refuses `disposable` for submodules, and `removePreservedWorktree` refuses again whatever the word says. The fixture only asserts `settle.command.length > 0`, and has no material rows, so a regression is invisible.
   - **Change:** Drop `submodule` from the alternation: `/\b(?:scratch repository|nested repository|material word)\b/iu`. In `release_case_submodule_force`, add one ignored nested repository to the derived worktree and assert `settle.disposableCommand === undefined`.
   - **Severity:** should-fix.

4. **`scripts/worktree.mjs:173-181`**
   - **What is wrong:** The submodule refusal fires on any index gitlink, populated or not, and on a derived worktree it says "Subject". Its remedy ("Push or move the submodule work ..., then retry") cannot work: after a push the gitlink is still in the index, so every retry refuses again. The comment says "populated" but the code does not check for it.
   - **Why it matters:** The operator is given a remedy that never clears the blocker. Separately, the check runs after `removeScratch` (`:313`, `:753`), so a "source retained" refusal has already deleted the scratch repositories.
   - **Change:**
     - Match Git's own rule by filtering to populated gitlinks: `.filter((p) => existsSync(join(subject, p, ".git")))`.
     - Say "Worktree holds a populated submodule".
     - Make the remedy: "push the submodule's commits, then remove this worktree from an operator terminal with git worktree remove --force <path>, and retry".
     - Run the check before `removeScratch`.
   - **Severity:** should-fix.

5. **`scripts/lib/paths.mjs:269`, `scripts/worktree.mjs:120` and `scripts/worktree.mjs:208`**
   - **What is wrong:** Three texts still say the close deletes no ignored material: "nothing in the release close deletes ignored material", "nothing here deletes ignored files", and "Nothing here deletes ignored bytes".
   - **Why it matters:** Since item 1 the close removes scratch repositories, which are ignored directories, so the remedy text and the comment now mislead the operator and the next editor.
   - **Change:** Say "the release close removes only scratch repositories; other ignored files are kept" in the remedy and the error, and update the derived-worktree comment the same way.
   - **Severity:** should-fix.

6. **`scripts/release.mjs:1661-1665`**
   - **What is wrong:** `ensureExistingRelease` byte-compares a published tag's annotation with `tagMessage(...)`. That is now rendered with identifier-only headings and absolute links that depend on `resolveGitHubPushTarget` succeeding.
   - **Evidence:** This order's own `docs/evidence/WO-188/wo199-regeneration.json` shows the regenerated v0.69.2 text differs from the stored one: title occurrences 5 to 1, relative links 10 to 0.
   - **Why it matters:** A partially published close whose tag the previous generator made, retried after this merges, now refuses permanently with "annotation differs". The exposure window is narrow but the failure has no remedy.
   - **Change:** Accept either rendering, for example `actual === expected || actual === tagMessage(root, manifest, { legacy: true })`, where `legacy` keeps `### id — title` headings and file-relative links in `releaseEdition`.
   - **Severity:** should-fix.

7. **`scripts/refute-plan.mjs:95-101`**
   - **What is wrong:** `RESERVED_LANE_NAMES` omits two names the lane's tools own: `entropy` (`scripts/lib/entropy-review.mjs:68`, `local/entropy`) and `resident` (`scripts/resident-bind.mjs:95`, `RESIDENT_LANE`).
   - **Why it matters:** An export named `docs/control/local/entropy` in a lane without that directory creates a file that later breaks the entropy reviewer's `mkdirSync`. This is the same defect class item 17 closes for `terms.txt`.
   - **Change:** Add `"entropy"` and `"resident"`, and add one fixture row that exports to `docs/control/local/entropy`.
   - **Severity:** should-fix.

8. **`docs/evidence/WO-188/regenerate-wo199.mjs:29-37`**
   - **What is wrong:** The `unavailableCells` detector only counts whole cells equal to `unavailable` or `unavailable (Δ unavailable)`. It recorded 0 _before_ the fix, although the stored body holds 75 `unavailable` tokens in compound cells such as `48,979,236 (Δ unavailable)` and `unavailable (Δ unavailable) / unavailable (Δ unavailable)`.
   - **Why it matters:** The "after: 0" fact offered for criterion 24 would hold with the fix removed.
   - **Change:** Count tokens on table rows instead, e.g. `(text.split("\n").filter((l) => l.startsWith("|")).join("\n").match(/unavailable/g) ?? []).length`, then rerun to refresh `wo199-regeneration.json`.
   - **Severity:** should-fix.

9. **`scripts/test-comment-labels.mjs:77` and `:32`**
   - **What is wrong:** `assert.doesNotMatch(JSON.stringify(result), /refuse a symlink twice/)` tests a string that is not in that fixture, so it is vacuous. The comment at `:32` says the fixture has "its own registry". In fact no registry is written; the real evidence-source registry is read, which is why `scripts/lib/paths.mjs` passes as registered in the next test.
   - **Why it matters:** The "line text is never stored" property is untested, and the comment points the reader at a registry that does not exist.
   - **Change:** Use `/refuse a symlink/`, which is case-sensitive and matches only the line-1 text. Reword `:32` as "The real evidence-source registry is read: scripts/lib/paths.mjs is registered, scripts/other.mjs is not."
   - **Severity:** should-fix.

10. **`scripts/lib/entropy-review.mjs:377`**
    - **What is wrong:** The comment says "a record carries no private path". The same subject keeps `scratchRepository`, an absolute path under the system temporary directory, and committed run records hold it (for example `docs/instance/entropy-reducer/runs/REFUTATION-002.json`, field `subject.scratchRepository`).
    - **Why it matters:** The comment overstates a privacy property that a later reader may rely on.
    - **Change:** Reword: "The launchpad is written relative; scratchRepository still records the frozen copy's absolute temporary path, which filing reopens."
    - **Severity:** should-fix.

11. **`scripts/lib/lifecycle-evidence.mjs:34-54`**
    - **What is wrong:** `mkdtempSync` runs before the `try` (`:58`). If `runGit(rev-parse)` or `copyFileSync` (`:42`) throws, the temporary directory leaks. The untracked names also go to `git add --pathspec-from-file` as pathspecs, so a name with glob characters or `:` pathspec syntax is not added literally.
    - **Why it matters:** The leak leaves state behind outside the repository, and a misread pathspec turns the whitespace check into an infrastructure refusal.
    - **Change:** Open the `try/finally` right after `mkdtempSync` and move the index copy and add inside it. Put `GIT_LITERAL_PATHSPECS: "1"` in `env`.
    - **Severity:** nice-to-have.

12. **`scripts/lib/worktree-material.mjs:256` and `:289`**
    - **What is wrong:** `prepare?.(directory)` discards the undo function that `restoreOwnedDirectoryWrites` returns. `accessSync` checks `W_OK|X_OK` but not `R_OK`, so a directory that cannot be read makes `readdirSync` throw a raw EACCES carrying an absolute path, without the repository's name.
    - **Why it matters:** A refused removal leaves changed directory modes behind, and the unreadable-directory failure gives the operator nothing actionable.
    - **Change:** `const undo = prepare?.(directory);` and call `undo?.()` before each refusal throw; use `constants.R_OK | constants.W_OK | constants.X_OK`.
    - **Severity:** nice-to-have.

13. **`scripts/lib/release-preparation.mjs:60`, `scripts/lib/worktree-integration.mjs:319` and `:395`**
    - **What is wrong:** The integration stub marker string and its "is it stubbed" read now exist in three places. `worktree-integration.mjs` already imports `decisionsConflicted` from `release-preparation.mjs`.
    - **Why it matters:** The writer and the two readers must agree byte for byte, and nothing ties them together.
    - **Change:** Export `integrationStubMarker(ref)` and `integrationStubbed(root, workOrder, ref)` from `release-preparation.mjs` and use them in all three places.
    - **Severity:** nice-to-have.

14. **`scripts/release.mjs:1619-1639`**
    - **What is wrong:** `regeneratedPullRequestBody` repeats the meter-block splice in `prepare` (`:2975-2985`) and the `resolveGitHubPushTarget` try/catch at `:1554-1559`.
    - **Why it matters:** These are two copies of the meter markers and of the null-target policy.
    - **Change:** Extract `withMeterBlock(source, table)` and `githubTargetOrNull(root)` and use each in both places.
    - **Severity:** nice-to-have.

15. **`scripts/lib/comment-labels.mjs:161` and `:225-227`**
    - **What is wrong:** `readBaseline` uses a raw `JSON.parse`, so a malformed baseline fails without naming the file. Every finding kind also gets the same remedy. By reading the lookbehind at `:22`, the second number in "WO-178 D012 and D023" is flagged as bare; this is an inference from the code, not a run.
    - **Why it matters:** Neither failure tells the writer what to do.
    - **Change:** Use `parseJson(readFileSync(...), baselineRelative(root))` from `scripts/lib/paths.mjs`. For `decision-number`, add "qualify it with its order (WO-NNN DNNN) or explain".
    - **Severity:** nice-to-have.

16. **`scripts/test-process-debt.mjs:10885-10909` and `:10992`**
    - **What is wrong:** The reference-transaction half of the "no nested hook or monitor ran" assertion cannot fail, because no close step writes a ref in a nested repository. The "planted hook is live" check proves the hook works, not the file monitor.
    - **Evidence:** In a Git 2.55 scratch repository, `ls-files --stage` ran the fsmonitor hook, while `rev-parse --verify`, `for-each-ref --contains` and `rev-list --all --count` did not. So the only live proof is the `ls-files` in `inspectNestedRepository`.
    - **Why it matters:** The fixture claims more coverage for criterion 3 than it gives.
    - **Change:** Before the close, run one flagless `git ls-files` in a nested repository, assert the marker appears, then remove it. Say in the comment that the monitor is the part the close can trigger.
    - **Severity:** nice-to-have.

17. **`scripts/lib/worktree-material.mjs:52` and `:58`**
    - **What is wrong:** "A word never follows a symlink" and "Material declaration refuses a symlink" now also guard scratch removal, where no word or declaration is involved.
    - **Why it matters:** "word" is order jargon, and the error misnames the failure.
    - **Change:** "A material path never follows a symlink, including its parents." and "Material path refuses a symlink".
    - **Severity:** nice-to-have.

18. **`packages/skeleton/src/harness-host.ts:137`**
    - **What is wrong:** `is_interrupt` is declared on `HarnessInput` but never decoded or read; only the test sends it.
    - **Why it matters:** It is an unused field in a registered source, and it suggests the field is handled.
    - **Change:** Drop it from the interface and from the test input.
    - **Severity:** nice-to-have.

19. **`scripts/lib/paths.mjs:111-133` and `:312`**
    - **What is wrong:** `declaredSubmodules(root)` runs two Git processes for every nested-repository candidate and repeats the gitlink parse in `scripts/worktree.mjs:175-177`.
    - **Why it matters:** Two copies of "what counts as a submodule" can drift; finding 4 already shows them disagreeing about "populated".
    - **Change:** Export one `gitlinkPaths(root)` (or the declared set), compute it once per inventory, and reuse it in `removePreservedWorktree`.
    - **Severity:** nice-to-have.

**Comment-rewrite sample:** I read about twenty hunks across `control.mjs`, `derived-contract.mjs`, `vertical-primitives.mjs`, `vertical-runtime.mjs`, `meta.mjs`, `release.mjs`, `product-read-guard.mjs`, `harness-prune.mjs`, `resident-bind.mjs`, `test-harness.mjs`, `test-runner.mjs`, `test-release.sh` and `test-plan-refutation.mjs`. Meaning is preserved. I checked the added qualifiers against the decision files: WO-112 D047, WO-123 D003 and WO-123 D024 exist, and the "(WO-112)" attribution for the former VER-001 F1 comment matches commit f0d55a1a. Apart from findings 5, 10 and 17, there is nothing to report.

Model and effort of this pass were not read back from the host and are unknown.

found 19

## Executor disposition

Fixed before handoff: 1 and 12 (two-pass removal with `onRemoved`, undo on refusal, readability in the preflight, the fixture asserts the other repository survives), 2 (the preview uses the same rows the removal does), 3 (`submodule` dropped from the material-cause matcher; the fixture plants a scratch repository and asserts no material command), 4 in part (the refusal runs before any scratch removal, is worded for a worktree and names the exact `git worktree remove --force` command; the index-gitlink rule stays, because Git's own `worktree remove` refuses on any gitlink in the index, populated or not), 5 (the three texts and their two assertions), 7 (`entropy` and `resident`, with six more names the adversary found), 8 (the counter counts tokens on table rows; the record now reads 75 before and 0 after), 9 (the assertion and the comment), 10 (the comment), 11 (the `try` opens at the temporary directory; pathspecs are literal), 15 (the baseline is parsed with the file named; each kind has its own remedy), 17 (the two texts), 18 (the field is dropped). Recorded, not fixed: 6 (no partially published close with the earlier rendering exists at this base, so the window is empty; a legacy rendering would keep two renderers alive), 13 and 14 (refactors of working code outside the order's items), 16 (the fixture's live proof is the file monitor; D003 and D005 say so), 19 (the two gitlink reads answer different questions, the index's pointers and the tracked tree's declarations).
