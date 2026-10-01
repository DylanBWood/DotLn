# WO-176 repaired fixture evidence

Observed in the executor's WO-176 checkout on 2026-10-01 UTC. The current
complete review passed all 39 suites. These fixtures use disposable local
repositories and the existing release adapter; they establish no real close
after merge and publish no work-order branch.

| Command | Observed result | Behavior covered |
| --- | --- | --- |
| `node --test --test-name-pattern='WO-176' scripts/test-process-debt.mjs` | Five cases passed; the full process-debt suite also passed in the current review. | State changes, uncommitted files, foreign worktrees, legacy rows and stale keep declarations cannot supply disposal authority; both actual executor completions record unknown material without refusal; lane rules, unit/collision preservation and bundle proofs hold. |
| `bash scripts/test-release.sh --case material` | Focused run passed; current complete review passed the expanded case in 76.58 seconds. | All six original modes plus multiple blockers, commit/dirt changes, same-path detached repositories, stale keep declarations, scoped retries, derived inventory refusal and record I/O failures. |
| `bash scripts/test-release.sh --case surfaces` | Focused run and current review passed. | Surface checks retain their existing behavior; they do not own the close record. |
| `bash scripts/test-release.sh --case surfaceclose` | Focused run and current review passed. | Actual close refusal records the target, refusal text, null tag outcome and no attempted cleanup; writer/runtime and whole-report checks remain intact. |
| `bash scripts/test-release.sh --case createrecovery` | Focused run and current review passed. | A pushed tag with a failed Release is partially published; a failed retry credits the earlier tag rather than inventing another push. |
| `bash scripts/test-release.sh --case lower` | Current review passed. | The lower target records no-release, with no tag publication. |
| `bash scripts/test-release.sh --case derived` | Current review passed. | Existing derived cleanup and retention protections remain effective. |
| `bash scripts/test-worktree.sh`, using the runner's `suiteEnvironment` | Focused run and current whole suite passed; review duration 95.82 seconds. | Scoped remedies and completion timing agree with existing preservation, tracked dirt, writer/gate and beacon checks; the empty verifier mount uses empty-repository classification. |
| `node --test --test-name-pattern='Node-only staged builds keep installed hooks' scripts/test-process-debt.mjs` | Earlier focused repair and current whole suite passed. | The fixture carries the existing browser workspace and installed dependencies; installed hooks run without a PATH compiler prerequisite. |
| `node --test scripts/test-release-fixtures.mjs` | Earlier three focused cases and current review passed. | The exact release-case inventory includes material and preserves runner isolation and duplicate rejection. |
| `node --test --test-name-pattern='real Git fast-forward' scripts/test-worktree-integration.mjs` | Earlier focused repair and current whole integration suite passed; review duration 263.69 seconds. | The complete build graph preserves recovery references, histories and authored conflicts through real generators. |

The material case executes the record's exact combined preserve command for two
repositories, including a path with spaces and an apostrophe, then reads both
preserved commits. Both Claude session variable spellings and actual dispatch
values are checked. The completion fixtures invoke the real implementation-ready
and repair-complete commands.

The drift cases add either a commit after an empty lane observation or an
uncommitted file after an explicit disposal declaration, then create a detached
derived worktree with a different repository at the same path. Publication
succeeds while both repositories remain. A subject-only flag cannot dispose of
the derived unit. A scoped protected-intake disposal attempt is contained after
the subject is removed, and the subsequent scoped keep settles the derivative.
A separate changed-keep case under `.runtime` retains the new file until a fresh
preserve word saves it.

Lane and explicit-disposal modes clone their recorded bundle after source
removal and read the saved commit. The process fixture also includes an
unreachable commit, checks unchanged source refs and bundle reuse, and rejects a
corrupted bundle while retaining its source. Bundle verification imports into an
empty bare repository and checks every expected commit and the pack.

A deliberately unusable record path cannot fail successful publication and
cleanup or replace the actual GitHub Release creation error. The retained
publication metadata distinguishes new tag push, an already published tag,
partial publication, surface refusal and no-release.

The intake fixture uses the actual directory-negating ignore policy and creates
its repository after the reviewed gate. The pre-existing gate cannot hash that
re-included repository directory when it is present during the gate;
FUP-bf51ac5cd8143d98 retains that separate repair. Moved-main retries and
concurrent/unbounded close history remain on FUP-da471832071118c7. They are not
claimed by the passing material cases.

`checks.json` carries the canonical current review row and document result.
Initial failed preparation is retained there; the stopped repair review has no
gate row and is recorded in decision D031. Test comments describe the invariant
without depending on an order-local finding identifier.
