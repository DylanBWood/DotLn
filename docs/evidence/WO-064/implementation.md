# WO-064 executor evidence

The implementation stages application `v0.43.0` under the order's minor
classification. No kernel, compiler, skeleton or console source changes, so no
runtime component, bundle pin or evidence edition moves; no dependency is
added. Actor: Claude Code `2.1.280` (installed CLI readback), model
`claude-opus-5-5[1m]` as selected by the operator, effort `unknown` (no value
supplied), source `operator-attested`; no effective-session readback.
Independent verification and final review remain separate dispatches.

`worktree publish WO-NNN --target <request.json>` publishes a target order's
finished source-change episode. The self-publication path is unchanged; its
`gh` preflight moved into `scripts/github-repository.mjs` so both paths share
one helper. The host logic is `scripts/lib/target-publish.mjs`; the pure
title/body generator is `generateTargetPullRequest` in
`scripts/github-body.mjs`. [Decisions](decisions.md) D001 to D004 record the
design, D005 the economy experiment and D006 a boarded-up runtime defect.

## Acceptance

| Criterion | Executable evidence | Observed result |
| --- | --- | --- |
| 1: refusals without the grant and on a lint failure naming the rule; granted publish with a pinned generated body | [test-target-publish.mjs](../../../scripts/test-target-publish.mjs) over four real `SourceChangeHost` episodes (codex double writer; the fourth added by the repair), a bare origin behind `https://github.com/dotln-fixture/target.git` and the `gh` stub | No grant and a `host-policy` grant each refuse with `repo.push is not granted … with operator provenance`; an edited contract refuses as not this loadout's writer compilation; a local term refuses `pr-body refused: vocabulary.local (line 3)`; a missing local-terms list refuses all four artifacts as unavailable; a moved branch, a matrix for another revision and, after repair, a matrix at the published head whose criteria are not the WorkOrder's refuse by name (D009). Each refusal leaves the stub log empty, the origin without the branch and no publication log. The granted run pushes exactly the observed commit (no tags, target `.git/config` unchanged), calls `gh --version`, `auth status --hostname github.com` and one `pr create --repo github.com/dotln-fixture/target --head fix/fixture-text --base main`, with a body byte-equal to the [pinned fixture](../../../scripts/fixtures/target-publish/body.md), and records one `PullRequestOpened {repositoryId, number, headSha}`; a rerun pushes and calls nothing. |
| 2: no launchpad vocabulary, DotLn path or worker narrative in the body | Same suite plus three generator cases in [test-github-body.mjs](../../../scripts/test-github-body.mjs) | The published body passes the pure lint; a fixture grep finds no `dotln`/`launchpad`, no `docs/`, `scripts/`, `packages/`, `.dotln`, `.claude` or episode path, no test command and neither of the double worker's two narrative strings. A contract naming `DotLn launchpad` yields two `vocabulary.launchpad` findings on the generated body. |
| 3: operator-run live smoke against a scratch remote, recorded as shapes | [smoke.mjs](smoke.mjs) → [smoke.json](smoke.json) | Operator-run on 2026-09-22 (gh `2.98.0`, https) against an empty scratch repository: the observed commit reached the remote branch; one pull request is `OPEN` against `main` with head ref, head commit, title and body equal to the branch, pushed commit, host commit subject and pinned generated body; one `PullRequestOpened` carries exactly `headSha`, `number` and `repositoryId`. Identifiers are recorded only as shapes. The writer was the deterministic double and the scratch grant was explicit host input (D004). |
| 4: write-backs | 07 §Workflow closeout and releases (target publish); 02 §Actors and episodes (`PullRequestOpened`); capability table `delivery.pull-request` dated addition; decisions and generated index row for the pre-2026-09-09 ledger duty; README release block | Planning check admits the dated capability addition as a WO-064 workspace update; publication check passes after the two edition locks were refreshed (no headings changed). |
| 5: `npm test` green; `git diff --check` clean; no new dependency | Canonical gate | First run: 25 passed, 1 failed (`worktree-integration`: the fixture's committed `github-repository.mjs` lacked the moved `ensureGh`; repaired in D007). Rerun at the current code: `npm test: 26 passed; 0 failed; 335.80 s`, recorded 2026-09-22T18:13:28Z. `git diff --check` clean; no dependency added. |

## Repair: VER-001 F1

VER-001 failed criterion 1's generated-body claim: a matrix was selected by
revision alone, so an unrelated `verified` criterion at the published head
reached the pull-request table. [D009](decisions.md) binds the matrix to the
WorkOrder by the compiler's existing description-coverage rule. The generator
refuses a mismatch and renders the contract's criteria in contract order, and
the host refuses the same mismatch before lint and the first remote call.

| Check | Observed result |
| --- | --- |
| `node --test scripts/test-github-body.mjs` | 16 pass, 0 fail. The new case replays VER-001's exact probe and refuses it, refuses a missing criterion, an extra row and a one-character description difference, and renders a reordered matching matrix in contract order. |
| `node --test scripts/test-target-publish.mjs` | 5 pass, 0 fail, 8.90 s. The new case refuses the demo's unrelated criteria at the published head with the gh log empty, no remote branch and no publication log, then publishes a reordered matching matrix whose body lists the three criteria in contract order as `incomplete` with `0 verified, 0 failed, 0 stale, 3 incomplete` and passes the outward lint. |
| Negative control | With the rule disabled, exactly the two new cases fail (15/1, 4/1); the source was restored byte-identical. |
| `npm test` at the repaired code | `26 passed; 0 failed; 358.36 s; 70 fresh tasks`, 2026-09-22. `git diff --check` clean; `package.json` and the lockfile unchanged. `npm run publication:check` passes after the software-engineer edition's lock was refreshed for the 07 sentence (no heading moved); `npm run plan -- check` admits the capability row as WO-064's dated addition; `npm run release -- prepare --local` reports `v0.43.0` current with no files changed. |

The absent-matrix path, the pinned body and the live smoke (which supplied no
verification store) are unchanged. Product 07 §Workflow closeout and releases
and the capability row state the binding. Repair entry usage: 82,131 total
tokens (`claude-transcript-message-usage`, dispatch scope, observed
2026-09-22T18:39:39.711Z); no subagents (0 of 20).

## Limits

- Today's target is the episode's Git root: WO-072 has not introduced a
  registered-id-to-clone mapping, so the committed grant registry cannot name a
  scratch path. The live smoke therefore passes its operator grant to the same
  `publishTargetOrder` function the CLI calls; the CLI path itself is proven by
  the fixtures (D004).
- The writer runs the order's loadout without its publication grants because
  the skeleton refuses any registry-bearing artifact identity (D002, D006). A
  writer loadout that needs any other grant therefore cannot compile for a
  target publication yet.
- Only a plain source-change episode is published; repair continuations
  (`executionBaseCommit`) are refused by the base binding.
- A crash after the pull request is created and before `PullRequestOpened` is
  appended needs manual inspection: a rerun pushes again and `gh pr create`
  reports the existing pull request as a failure (D004).
- The acceptance matrix renders only when the one matrix for the published
  head carries exactly the WorkOrder's criteria (D009). The host-path fixture
  moves the real verification host's opening event to the published head, so
  its rows are `incomplete`. The fixture cannot move a `verified` matrix to the
  published head, because rewriting any later demo event fails replay, so
  `verified` rendering is exercised through the pure generator.
- The live smoke's writer is the deterministic double; no model is invoked.
- `worktree-integration` fixtures overlay only the root-level peers that
  `worktree.mjs` imports statically; a new static import needs the same entry
  (D007).

Entry usage: 38,009 total tokens (`claude-transcript-message-usage`, dispatch
scope, observed 2026-09-22T17:32:30.984Z). Final counters are in the handoff
response. No subagents were spawned (0 of 20).
