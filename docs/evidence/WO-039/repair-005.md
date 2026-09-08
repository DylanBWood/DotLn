# WO-039 fifth repair — integration with the moved base

**Source.** [FINAL-001](../../final-reviews/WO-039/FINAL-001.md) finding F1:
`main` advanced by two merged orders while this order was in flight, the new
console workspace stays raw in the declared feedback source projection, and
the integration the review window owns could not be completed without a fresh
live feedback edition, which a reviewer must not author and certify. Canonical
control recorded `RepairRequested` against `FINAL-001` at checkpoint 21
(`33f7c83cd42f366a736f100b151814a13c1c2f38`) from the `resume: fix` dispatch.
This receipt maps that finding, the routine integration bookkeeping the review
named, and the one acceptance defect the integrated gate then revealed in the
merged console workspace; the [first](repair.md), [second](repair-002.md),
[third](repair-003.md) and [fourth](repair-004.md) receipts stand.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.263","model":"claude-fable-5-1","effort":"max","source":"self-reported"}

The session selector was the operator's `/model` choice at `max`; the harness
exposes `CLAUDE_EFFORT=max` to child processes but no recorded effective-session
readback exists for this version, so the source is self-reported.

## Instrument disclosure

This repair ran under the installed bundle it integrates. The generated prompt
hook resolved `resume: fix` to the executor role and named the selected order;
the generated guards judged every tool call. Five refusals were witnessed and
none was bypassed: listing the local harness state directory and reading a
user-scope debug log were refused as effects the compiled authority does not
permit, and three diagnostic commands that changed directory or pointed Git at
a directory outside the worktree were refused because the writer guard could
not resolve host facts for a foreign cwd. Each was replaced by a command run
from the worktree cwd or dropped.

The sandbox shapes what this session can witness. It denies writes into any
`.git/hooks` under the worktree, so `git init` inside `.runtime/` stops at the
sample hooks and leaves a partial repository; the temp root is the aliased
`/tmp`, which the feedback host refuses by design; and neither CLI transport
can start from inside it: Codex reports that it cannot initialize its
in-process app-server client, and a nested Claude print session reports that
it is not logged in. Live evidence therefore needs a terminal outside the
sandbox, as the fourth repair's operator step did.

No branch commit was made. The eleven paths that carried text conflicts are
staged so the index holds no unmerged entries; the auto-merged and untouched
paths remain unstaged or untracked as before. The stash and every checkpoint
ref are retained.

## Finding F1 — diagnosis and repair

**Diagnosis.** The branch base was `8b55eca3b3427146e98d34c68f67f679dc59bea5`
and `main` was `1937b023187a813f3b8053a221f819a15cdad244`, twelve commits
ahead across WO-032 (`v0.14.0`, the `packages/console` workspace) and WO-109
(`v0.13.3`, the re-mining practice); 101 files changed upstream, 17 of them
also changed by this order. `feedbackSourceFile` strips release labels only
from the lockfile root and the three workspace entries it names, so the
console entries stay raw in the feedback subject; the recorded edition's
subject `sha256:4a153ea7fac3d51e328798eea62ee7c1bd3c288953b9fbf83c727c2ca9c7fa4c`
cannot describe the integrated tree, and `feedback-evidence.mjs --check`
refuses it there. This is the projection limitation WO-041 recorded; this
order did not introduce it, and generalizing the projection is a behavioural
change to a pinned source that the review asked not to be folded in silently.

**Repair.** The integration followed the guide's preserve, fetch/merge, apply
and regenerate procedure without a work-order commit:

1. Preserve: the 17 dual-side files were stashed as
   `WO-039 integration 2026-09-08 before fast-forward to main`, stash
   `b0077782000c90651a232c448ce34353dda0d96c`, applied with `git stash apply`
   and never dropped. Checkpoint 21 also holds the whole pre-merge tree.
   Untracked work stayed in place; the sandbox denies removing the installed
   hooks directory, so an untracked-inclusive stash was not attempted.
2. Fast-forward: `git merge --ff-only main` moved `wo-039` from `8b55eca` to
   `1937b02`.
3. Apply: re-applying the stash auto-merged six files and left eleven text
   conflicts, resolved as the table below records.
4. Regenerate: the work-order index; both publication source locks from
   `check-publication --print-locks` (241 of 241 headings indexed, both
   editions `CURRENT`); the context measurement, which regenerated
   byte-identically because both sides of the controlled comparison read task
   files from the frozen activation snapshot, so the review's expected drift
   from WO-109's paragraph in 08 §PRs and commits cannot occur under the
   recorded method; the control projection is left to the next legal
   transition, as the executor procedure requires, and canonical status is
   unaffected because it folds the segments directly.
5. Release: `release prepare --local` reports that target `v0.15.0` remains
   current and changes no file; `check-surfaces --local` passes against the
   `v0.14.0` baseline the integrated ancestry exposes, with compiler `0.7.0`
   and skeleton `0.13.0` satisfying the changed-source rule; after the
   console finding below, console `0.1.1` satisfies it as well.
6. Build: `tsc -b` exits 0 for all four workspaces. Nothing imports
   `@dotln/console` by name, so the missing workspace link in this worktree's
   `node_modules` affects no check; the lockfile carries `main`'s console
   entries plus this order's workspace bumps (compiler, skeleton, and console
   after the finding below) and the skeleton's compiler pin, and nothing else.
7. Feedback evidence: the pre-integration report and streams are preserved
   unchanged in [feedback-pre-integration](feedback-pre-integration/), because
   the writer accepts one immutable edition per identifier. `evidence:feedback
-- --write` recorded the integrated report at
   [feedback/feedback.json](feedback/feedback.json) with subject
   `sha256:bf3cf4b14ba5d6a9d0a82cad636309618e6d797d1f3888e1bc08650fae1698e6`,
   the exact hash FINAL-001 computed for the integrated tree. The console
   finding below then moved the lockfile's console entry, which is raw in the
   subject, so that report is preserved as
   [feedback-integration-draft](feedback-integration-draft/feedback.json)
   and the report for the final integrated subject
   `sha256:3546ed4fd50367f10831fb5510a60efc21df7d9b5f4c959379c88333eb03fb40`
   is recorded at [feedback/feedback.json](feedback/feedback.json) with the
   same policy hash `fnv1a64:f78e381ffafce1e9`. Its live audit and verifier
   streams are recorded from the fourth attempt under Live evidence attempts.
8. Write-backs: the ledger carries the dated fifth-repair section with the
   rejected alternatives, the live edition's recording and the operator's
   gate-chain decision; the planning map nominates the workspace projection
   generalization and the console host-collection budget as unallocated
   evidence candidates; the evidence README and the skeleton runbook name the
   integrated edition.

### Resolutions

| Path                                                                                                                                                      | Resolution                                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                                                                                                                                            | Combined: `main`'s console clean, guard and test steps and its three console scripts, with this order's harness fixture, drift, context and evidence steps, its `harness` and `terms` scripts, and `--edition WO-039` in both `test` and `evidence:feedback`. |
| `package-lock.json`                                                                                                                                       | Auto-merged: `main`'s lockfile with compiler `0.7.0`, skeleton `0.13.0` and the skeleton's compiler pin.                                                                                                                                                      |
| `README.md`                                                                                                                                               | This order's `v0.15.0` release claim, naming the actor board among the surfaces that remain available; `main`'s console bullet and horizon text auto-merged.                                                                                                  |
| `docs/product/13-uifa-roles.md`                                                                                                                           | Authored merge of the five rows: WO-032's board panels and this order's Contributor entries both in Today, the shipped items removed from Next planned rungs, and WO-032's Actor board role service subsection retained.                                      |
| `packages/skeleton/README.md`                                                                                                                             | One edition sentence: the WO-039 edition, because the compiler bump and the integrated console workspace both change the pinned identities; WO-011, WO-041 and WO-032 receipts stay historical bytes.                                                         |
| `.prettierignore`, `docs/planning/capability-table.md`, `docs/lineage/idea-ledger.md`                                                                     | Concatenated: `main`'s WO-032 blocks first, then this order's.                                                                                                                                                                                                |
| `docs/product/04-interfaces.md`, `06-roadmap.md`, `07-execution-guide.md`, `docs/planning/work-order-map.md`, `docs/publication/audience-status-index.md` | Auto-merged; both sides' additions present and reviewed.                                                                                                                                                                                                      |
| `docs/work-orders/README.md`, both publication `-toc.md` locks                                                                                            | Regenerated.                                                                                                                                                                                                                                                  |
| `docs/control/current.md`                                                                                                                                 | `main`'s projection kept; rewritten by the next legal transition.                                                                                                                                                                                             |

## Finding from the integrated gate — the board's self-hosted edition

**Diagnosis.** The first full gate on the integrated tree,
[repair-005-checks-001.txt](repair-005-checks-001.txt), exited 1 inside
`npm test`: 301 of 306 runtime tests passed, five WO-032 console tests
failed, and the feedback evidence step was never reached. Four of the five
share one cause. `packages/console` as merged reads the WO-011 self-hosted
edition by default and pins that edition's two streams and maturity report as
its `wo011` fixture case. Both recorded identities fold in the compiler
package version. Under compiler `0.7.0` the ten unchanged units compile to
policy hash `fnv1a64:f78e381ffafce1e9`, while the WO-011 and WO-032 editions
record `fnv1a64:d0000feb2622b0d4`; and when the worker-status projection
replays the WO-011 verifier stream, the skeleton's reactor refuses the
persisted verification command as `persisted compilation drift`, because the
pinned capsule no longer recompiles to the same input hash. The board renders
that edition's verifier actors and maturity counts as unavailable, which is
its documented behaviour for a historical edition, and WO-032's pinned
expectations for that case (`AC1/6 wo011`, `AC2`, `AC4`, and the tester
and devops cells in `AC5`) fail. The fifth failure, the host-collection
test, reported `release:list` unavailable; the same test passes alone in
fifteen seconds, so under the full gate's concurrent subprocess load the
collector's fixed sixty-second command budget was exceeded. That is a load
effect of the gate chain, which WO-032's own review had recorded as an open
item, not a code defect; the operator decision recorded below resolves it for
this gate.

Neither order is wrong on its own. WO-032 pinned the edition that was current
on its base, and this order's compiler bump is the recorded reason the root
evidence command already selects the WO-039 edition. Together they are an
acceptance defect on the merged tree, which the guide's integration rule
sends through repair and fresh verification rather than through review.

**Repair.** The actor board follows the root feedback edition.
`packages/console/src/collect.ts` declares `SELF_HOST_EDITION = "WO-039"`
and derives the default audit and verifier store paths and the maturity
report path from it, under edition-neutral store ids `selfhost-audit` and
`selfhost-verifier`. The fixture case `wo011` becomes `selfhost` in the
manifest, the role mapping, the tests and `combinedFixture`; it pins the
report and both streams of a WO-039 edition recorded under compiler `0.7.0`.
While the integrated edition's streams were unrecorded, the case pinned the
preserved [pre-integration edition](feedback-pre-integration/), whose one
physical verifier attempt completed through Codex; once the fourth live
attempt recorded them, the continuation re-pinned the three manifest inputs to
[feedback](feedback/) and regenerated the expected outputs. The `AC2` test
derives the accepted verifier attempt from the admitted matrix's producing
episode instead of naming WO-011's fourth attempt, and checks every other
recorded attempt as lease-expired without a matrix link; the criterion's
substance is unchanged: the script executor and the verifier stay separate
actors with different hash kinds, phases and authority summaries, each linked
to its recorded build, receipts and matrix.
`console-fixtures.mjs --write` regenerated the expected outputs: the
`wo009`, `control`, `refutations` and `missing` cases are byte-identical,
the `wo011` outputs are removed and `selfhost` is recorded. Console
component `0.1.0` becomes `0.1.1` in its manifest and the lockfile's
workspace entry, a patch because the `uifa-board-v1` contract and both
renders are unchanged and only the default evidence edition moved; the console
runbook names the selection and the duty to re-pin the case when the edition
moves. Changed paths: `packages/console/src/collect.ts`,
`packages/console/test/board.test.ts`, `packages/console/test/fixtures.ts`,
`packages/console/fixtures/manifest.json`,
`packages/console/fixtures/role-answers.json`,
`packages/console/fixtures/expected/selfhost.{json,txt,html}` replacing
`wo011.{json,txt,html}`, `packages/console/package.json`,
`packages/console/README.md` and the lockfile's console version.

**Validation.** `node --test packages/console/dist/test/*.test.js` passes 18
of 18 on the changed console; one earlier run in the same chain, before the
re-recorded report existed, failed only the host-collection test on the
missing maturity file and is superseded. `release check-surfaces --local`
passes with console `0.1.1` under the changed-source rule, `check-publication`
reports both editions current, formatting and `git diff --check` are clean,
and `release prepare --local` reports no change. The second full gate is
described under Validation.

**Alternatives.** Keeping the WO-011 pins would leave the merged tree unable
to pass its own gate on this compiler. Relaxing the reactor's drift refusal
for read-only projections would change a pinned runtime source under the
WO-029 identity contract and is nominated separately on the planning map,
together with selecting the edition from one declared source instead of a
constant beside the root script's `--edition` flag.

## Evidence-impact assessment

Runtime sources, tests, scripts, the installed `.claude/` and `.agents/`
surfaces, the discovery record and the instruction file have no diff from
checkpoint 21 apart from `main`'s own `scripts/console-fixtures.mjs` and the
console change recorded above, compared tree to tree through a scratch index
that includes untracked files, and `harness check` reports the same 24
generated surfaces with the local terms list present, so criteria 1 through 7
keep their original evidence unchanged: the discovery record, fixtures, live
role smokes, drift fixture, context measurement and write-backs judge the same
bytes VER-004 judged. The acceptance claims the integration touches are
criterion 8's full gate, within it the feedback evidence step whose subject
moved twice for the reasons above and the console suite that now judges the
WO-039 edition, and WO-032's fixture-pinned claims 1, 2, 4 and 5, whose
`selfhost` case now pins that edition. Those claims return through the fresh
edition and independent verification; no other claim is re-argued here.

## Live evidence attempts

| Attempt | Store                                                     | Transport and selection                    | Outcome                                                                                                                                                                                                                                                                                                                                                                                             |
| ------- | --------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 001     | `.runtime/feedback-wo039-integration-001`                 | `codex-cli-exec`, `gpt-6-astra`, `unknown` | The audit completed for the integrated subject and the verifier command persisted; the mount's `git init` was denied under the worktree and surfaced as the generic host refusal. Pending work retained.                                                                                                                                                                                            |
| 002     | the session temp root, reached through the aliased `/tmp` | same                                       | Refused before any attempt as `feedback verifier mount alias`, reproduced through a direct library call; the runbook documents this refusal. Pending work retained in the session's temp root.                                                                                                                                                                                                      |
| 003     | the physical temp root                                    | same                                       | The mount passed, the attempt started and a receipt was recorded, then the worker was interrupted within two seconds as `transport-failed`. Direct probes show Codex cannot initialize its app-server client here and Claude print is not logged in.                                                                                                                                                |
| 004     | `.runtime/feedback-wo039-integration-004`                 | same, from a terminal outside the sandbox  | The operator ran the exact command from this receipt on 2026-09-08. The audit completed in four seconds for the final integrated subject under policy `fnv1a64:f78e381ffafce1e9`; the verifier attempt started through Codex CLI `0.153.4`, held its lease through eighteen host heartbeats, and completed in nineteen seconds with both criteria verified and no findings. The matrix is complete. |

The first three are not live editions: no model output was produced or
recorded, and no budget was spent beyond the failed launches. The fourth is
the live edition. `evidence:feedback -- --record-selfhost` validated its
streams against the current source, the compiled policy and the recorded
report, then wrote them beside [feedback.json](feedback/feedback.json) as
[selfhost-audit.jsonl](feedback/selfhost-audit.jsonl) and
[selfhost-verification.jsonl](feedback/selfhost-verification.jsonl),
byte-identical to the store. The verifier's input hash is
`fnv1a64:c9955a2344c45b3a`; its model and effort are the recorded launch
selection, not effective-session readback.

## Validation

Checks executed on the integrated tree before the full gate: `git diff HEAD
--check` clean; Prettier clean on every touched file; `work-orders index
--check` current; `release check-surfaces --local` passing; `harness-context
--check` passing with all eight rows lower; `harness check` reporting 24
generated surfaces; `check-publication` reporting 241 of 241 headings and both
locks current; `evidence:feedback -- --write` recording the integrated report.

Seven gate transcripts follow. Each is filed with this checkout's address
replaced by `<repo>`, so no filed evidence carries a local path.

- [repair-005-checks-001.txt](repair-005-checks-001.txt) is the first full
  gate through `npm run harness -- evidence` on the integrated tree, before
  the console change: 301 of 306 tests passed, the five failures were the
  WO-032 console cases diagnosed above, and the chain stopped before the
  feedback evidence step.
- [repair-005-checks-002.txt](repair-005-checks-002.txt) is the full gate
  after the console change: 305 of 306 passed. The one failure is the WO-032
  host-collection test, whose release listing exceeded its sixty-second
  budget under the full-gate load (84957 ms) and rendered `release:list`
  unavailable. The gate then refused its own receipt with
  `Source changed during required checks`, because this session filed the
  first transcript while the gate was running; that refusal is the gate
  working as designed, and the run's test outcome stands as recorded.
- [repair-005-checks-003.txt](repair-005-checks-003.txt) is the same full
  gate on a quiet tree: 305 of 306 passed with the same single
  host-collection failure (86427 ms), `git diff --check` exited 0, no source
  changed during the run, and the gate recorded `npm test` as executed with
  exit code 1.
- [repair-005-checks-004.txt](repair-005-checks-004.txt) runs the console
  suite alone and then every gate step after the four-package test run,
  individually on the same build. The console suite passed 18 of 18 in
  nineteen seconds, including the host-collection test, so the budget failure
  is a load effect of the four-package run rather than a defect in either
  order; the sixth transcript later showed the same effect outside the
  sandbox. The harness fixture suite passed 17 of 17; `harness check`, the
  context measurement, the live evidence gate, the plan-refutation fixtures,
  the WO-101 corpus, the artifact-identity and verification evidence checks
  and the mutation self-tests all exited 0. The feedback evidence check exited
  1 because the integrated edition's `selfhost-audit.jsonl` did not exist
  until the fourth live attempt recorded it.
- [repair-005-checks-005.txt](repair-005-checks-005.txt) is the full gate on
  the quiet tree after the live edition was recorded and the console's
  `selfhost` case re-pinned to it: 305 of 306 passed with the same single
  host-collection failure (86677 ms), `git diff --check` exited 0, no source
  changed during the run, and the gate recorded `npm test` as executed with
  exit code 1. The chain stops at that test run, so the later gate steps did
  not execute inside this transcript.
- [repair-005-checks-006.txt](repair-005-checks-006.txt) is the operator's
  full gate from a terminal outside the sandbox on the same quiet tree as the
  fifth transcript: 305 of 306 passed with the same single host-collection
  failure (82526 ms), so the budget is exceeded under full-gate load on this
  host with or without the sandbox, and the gate recorded `npm test` as
  executed with exit code 1.
- [repair-005-checks-007.txt](repair-005-checks-007.txt) is the full gate in
  this sandbox on the quiet tree after the operator's decision, with the
  console suite in its own step: the kernel, compiler and skeleton suites
  passed 288 of 288, the console suite then passed 18 of 18 alone with the
  host-collection test at 38374 ms, and every later step exited 0, including
  the feedback evidence check on the recorded edition. `git diff --check`
  exited 0, no source changed during the run, and the gate recorded
  `npm test` as executed with exit code 0.

Taken together, the four full gates before the chain change each failed only
on the console host-collection budget under full-gate load, in this sandbox
and outside it, while the console suite passed alone; the seventh transcript
is the full gate on the serialized chain and passes every step, including the
console suite on the re-pinned `selfhost` case and the feedback evidence check
on the recorded edition, with `git diff --check` clean. The completion receipt
the installed hooks read needs `npm test` to exit 0 at the current subject;
the quiet rerun described under the operator decision below holds it.

## Operator decision before completion

The live audit this section first named ran on 2026-09-08 from a terminal
outside the sandbox and is recorded as attempt 004 under Live evidence
attempts. This session then recorded its streams with
`npm run evidence:feedback -- --record-selfhost .runtime/feedback-wo039-integration-004`,
re-pinned the console's `selfhost` manifest inputs to the recorded
[feedback](feedback/) report and both streams by their sha256, regenerated the
case's expected outputs with `node scripts/console-fixtures.mjs --write` (the
`wo009`, `control`, `refutations` and `missing` outputs are byte-identical),
and ran the full gate filed as
[repair-005-checks-005.txt](repair-005-checks-005.txt).

The receipt then named one operator step: the full gate from a terminal
outside the sandbox, captured outside the tree and filed as
[repair-005-checks-006.txt](repair-005-checks-006.txt), followed by a quiet
rerun to hold the completion receipt, with the rule that a repeat of the
host-collection failure there stops the protocol and puts the console budget
to the operator. The operator ran the first command on 2026-09-08 and the
gate failed on that test alone, so the sandbox-load reading the ledger's
deferral rested on was refuted and the session stopped as the rule required.

The operator then superseded the deferral, choosing the direction the
planning map names last and WO-032's own review listed as a hardening
candidate: the root `test` script runs `node --test` over the kernel,
compiler and skeleton suites first and the console suite in a second
invocation after them, so the board's fixed read-only commands run while no
other package suite loads the host. The console budget, WO-032's test and the
console source are unchanged; the release listing takes twelve seconds alone
here. Raising the budget was rejected as load-dependent, since the listing
took between eighty-two and eighty-seven seconds across the four full runs,
and because a longer budget delays the board's `unavailable` verdict on a
stuck command. Leaving the order blocked until a separate console order lands
was rejected as holding a finished repair on a gate-chain question. The
ledger records the supersession with both rejections, and the planning-map
candidate keeps the two directions not taken.

With the chain changed, this session ran the full gate in the sandbox,
captured outside the tree and filed as
[repair-005-checks-007.txt](repair-005-checks-007.txt), then ran it once more
over the tree that includes the transcript and these write-backs; that quiet
run holds the receipt the installed completion hooks read, and its exit code
is reported at the handoff rather than filed. The session then records
`npm run resume -- repair-complete` with its actor flags (control-plane writes
lie outside the receipt's subject), refreshes the work-order index, and reads
every changed output. Canonical control owns that handoff; independent
re-verification of the affected claims remains separate.

## Limits

This receipt is executor evidence about an integration, not a re-verification
of the order. The merge preserved behaviour by construction, which the empty
runtime diff against checkpoint 21 witnesses, and the integrated gate's
feedback step passes on the recorded live edition. The live smoke
records are untouched and still describe the same installed bundle. The
open question the review named, whether to generalize the workspace
projection, is nominated and not decided here, as is the console's edition
selection. The console's host-collection test runs each fixed read-only
command under a sixty-second budget; under full-gate load the release listing
exceeded it in four full runs, in the sandbox and outside it, while passing
alone, so by the operator's decision the root gate runs the console suite
after the other three package suites. That is a gate-chain change, not a
console change: the budget, the board's behaviour and WO-032's test are
untouched, a host where the listing exceeds the budget even alone would still
fail that test, and the budget question stays nominated on the planning map.
The `selfhost` fixture
case now pins the recorded integrated edition, the one the root evidence
command selects; the preserved pre-integration edition under
[feedback-pre-integration](feedback-pre-integration/) remains a real recorded
run under the same compiler and policy hash, kept as history.
