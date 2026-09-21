## Release overview

DotLn runs two work orders in parallel worktrees as its normal workflow, and whichever lane finishes second has to pull the other's merge into a live tree. Until now that was a prose checklist the reviewer ran from memory: preserve the branch's work, merge main, regenerate every generated projection, union the follow-up register, retime a release target the sibling took, and work out which checks the new base invalidates. This release makes it one command, `npm run worktree -- integrate WO-NNN`, run inside the order's own worktree.

The payoff is that the mechanical part is executed and inspectable instead of remembered, and that it is recoverable at every step. The judgment part is unchanged and still the reviewer's: authored conflicts, carried-forward acceptance claims, component-version collisions and the merge commit itself.

This matters to anyone running concurrent work orders. It changes nothing for a single-lane run.

## Read before upgrading

The command exits nonzero while authored work remains, and that is its normal reporting path, not a failure. Resolve the listed paths, `git add` them, then run `npm run worktree -- integrate WO-NNN --continue`. An ignored receipt at `docs/control/local/integration.json` carries the original bases, the checkpoint and the stash across that boundary; starting a fresh integration while one is pending is refused.

Ignored intake now requires a named external backup. If `docs/intake/` holds ignored material, the command refuses unless `--intake-backup <archive.zip>` names a readable archive, outside the worktree, whose stored bytes match every current intake file. Create one with `npm run backup:intake` first. A stale archive is refused as explicitly as a missing one.

The command refuses three cases outright and changes nothing when it does: run outside a worktree whose branch matches the named order, an upstream that cannot be resolved on `origin`, and the intake case above. It also refuses to start while a product gate is live, and while an unfinished merge is already in progress.

`@dotln/skeleton` advances to `0.33.1` because the reviewer role's integration instruction is skeleton source, so the generated role skills and the harness manifest hashes change with it. No third-party dependency is added, removed or re-ranged, and no schema version changes. No migration step is required.

## Substantive changes

**Recoverable integration.** A checkpoint ref is minted before anything moves, capturing untracked bytes as well as tracked ones, and a named `--include-untracked` stash is taken and kept. The stash is applied, never popped or dropped. A branch with no commits of its own is fast-forwarded; a branch carrying reviewed commits gets an uncommitted `--no-ff` merge, so nothing is rewritten and `MERGE_HEAD` is left naming the incoming base for the reviewer to commit. An interrupted stash application is detected and refuses to apply twice; a failed merge keeps both the checkpoint and the stash and says so.

**Generated surfaces regenerated, authored bytes preserved.** Conflicting pure projections — the harness bundle and manifest, the control projection, the work-order index, the decisions index, the generated role skills and the console expected outputs — are resolved by rerunning the repository's existing producers rather than by choosing a side. Mixed documents are re-merged with only their generated fragment masked, so `CLAUDE.md`'s harness block, an edition's `Source lock:` line and the README release claim regenerate while the authored prose around them still goes through Git's three-way merge and may still conflict. Everything genuinely authored is listed by name for explicit resolution.

**Follow-up register union by entry id.** Both lanes' entries survive, matched by identity rather than line position, with the longer revision and disposition histories kept when one side is a prefix of the other. A divergent history for the same entry id is refused to authored resolution rather than renumbered, because renumbering a source revision changes what a past disposition referred to.

**Release retiming and a draft decision.** A colliding unpublished target is retimed through the existing `release prepare`, which also updates the README claim and the dated roadmap note under the recorded classification. The command then appends a dated draft integration decision naming both bases, the checkpoint, the retained stash and the resolved projections, with the carried-forward acceptance claims left explicitly marked for the reviewer to complete.

**Affected checks reported, never run.** The integrated tree's checks are printed rather than executed: the product gate, `publication:check`, `harness check` and the local release-surface check. The choice between `npm test` and `npm test -- --review` comes from the test runner's own declared machinery sources rather than a path heuristic, so a changed package source selects the review run. The helper runs no gate, appends no repair, verification or lifecycle event, and reads no sibling order's phase as admission authority.

**Documentation and role text.** Product 07's integration checklist now names the command and remains its definition; the PLAYBOOK's concurrency procedure calls the helper instead of spelling out eight steps; and the reviewer role's generated instruction tells the integrating reviewer to run it, resolve, continue, complete the draft decision and run the printed checks.

## Progressive polish

The checkpoint minting shared with `resume` moved into its own module without behavior change beyond refusing to overwrite an existing checkpoint ref, the control projection renderer gained a reusable refresh entry point, a `worktree-integration` suite row joined the runner's protection table, the process-debt role snapshot gained a separate WO-079 oracle while both historical baselines stay byte-checked, and the regenerated harness surfaces, manifest hashes, decisions index and work-order index moved with the release. Full detail is in the diff rather than here.

## Evidence and compatibility

Source tag `v0.37.1`, a patch above the published baseline `v0.37.0`, under the order's existing classification. `@dotln/skeleton` ships at `0.33.1`; compiler, kernel and console behavior are unchanged.

Verification result: [VER-001](../../verifications/WO-079/VER-001.md), pass, with seven limits recorded rather than none. Final review is [FINAL-001](FINAL-001.md); it closed the first limit by making the fixture's reviewed-merge case assert the retime and the draft decision it had only implied, resolved the second by reading, and left the rest standing as recorded. The product gate at final review passed 30 suites, 0 failed, in 497.36 s over 74 fresh tasks, outside the sandbox from the start, with `git diff --cached --check` clean, documentation checks 19 passed, publication coverage 272/272 and 31 generated surfaces validated.

Known limitations, stated plainly. The helper has not yet run a real integration: `main` did not move while this order was in flight, so its own final review had nothing to integrate, and all evidence is the synthetic real-Git fixture. No time saving is measured or claimed; the order's cost figures describe the problem, not the result. A divergent same-entry register history is asserted at unit level but not driven through the resolution path end to end, and the decisions-index conflict is covered only by the checks that follow it. The reopening condition is written for the first real use: an integration that needs a mechanical step the command does not cover, or a fixture showing loss of authored bytes, recovery material or either register history.
