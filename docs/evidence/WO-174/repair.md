# WO-174 repair of VER-001 F1

Dispatch: `resume: fix`, 2026-09-30. Base: `dd141ad16dbd60e39ffb5afab21df57689cf4b79`.
The failed report remains immutable. The application patch target is now
`v0.58.1`, retimed by local release preparation (D017).

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.159.2","model":"gpt-6.1-sol","effort":"max","source":"codex-session-readback"}

The repaired rule: every tracked consumer of the renamed console fixture
helper uses its lazy API, and regeneration validates the same manifest
snapshot it writes or renders. Importing the helper reads no manifest.

`scripts/console-fixtures.mjs` now calls `readFixtureManifest()` after
validating its arguments. `loadFixture` accepts that snapshot explicitly;
its default still loads lazily when a caller invokes it. The recorder
passes its newly pinned draft into the pre-write validation. A simple
import rename alone would have validated the old on-disk manifest there.
D015 records the evidence, alternatives and correction.

Two new `[document]` cases in `board.test.ts` check the actual generator
against the current built exports and reject an invalid draft pin without
changing the recorded manifest or affecting a later default load. Existing
test assertions and the 43 prior case retags are retained.

## Executed evidence

Source: the repair session's executed commands, canonical gate row and
preserved scratch logs; product observation cutoff
`2026-09-30T20:00:31.034Z`, document cutoff
`2026-09-30T20:06:11.760Z`. Scratch paths below are normalized.

| Check | Observation |
| --- | --- |
| Fresh build, before repair; generator `--check` | Build passed; generator exited 1 with the missing `manifest` export, reproducing F1. |
| Fresh build and both new document cases | Passed; two cases, zero failures. |
| Generator regression with the base's stale consumer in scratch | Exited 1 and named the missing export. |
| Draft regression with a scratch helper that ignores the supplied manifest | Exited 1: `Missing expected exception`. |
| Generator `--check`, repaired committed copy | Exited 0; all five fixture cases matched JSON, terminal and HTML. |
| `node scripts/test-runner.mjs --only worktree-integration --again`, committed copy | Passed; suite 296.47 s, aggregate 297.15 s (build plus suite). The enclosing invocation was 297.563 s. |
| Generator `--write`, committed copy | Exited 0; manifest and all expected fixture bytes were unchanged. |
| Generator `--record-current-selfhost`, then `--check`, committed copy | Both exited 0. |
| `npm test -- --review --again`, working tree | 37 suites passed, zero failed, 81 fresh tasks; canonical duration 396516 ms. |
| `npm run test:docs`, working tree | 24 suites passed, zero failed, 24 fresh tasks; canonical duration 35268 ms, including the two new document regressions. |

The disposable copy starts at the executor base, overlays only the
working tree's tracked changes and nonignored new files, and commits them
on a detached scratch HEAD. It has its own workspace package links and
fresh build. The synthetic subject is
`f3b6407327153a5c95cfa8abc74e1883092374bb`; no work-order branch commit was
made. Its setup, command outputs and negative controls remain in
`<session-scratch>/repair-copy.json` and `repair-*.log`.

The working-tree product row has code identity
`617f10c1852188fe21ac2085485e9442dc43be9a78fc72becab38b09d9db2cf1`.
All four guarded package logs have zero excluded-read observations. No
code changed after that gate. The original guard, document-input and
harness-selection drills remain applicable to unchanged repair surfaces,
and VER-001 independently reproduced them; this repair does not rerun
those unchanged probes.

## Retained planning inputs and limits

The guard's specified Node fs set, inheriting-child boundary, native-read
limits and direct machinery-closure boundary are unchanged. D013's
product script-suite input coverage remains pending as
`FUP-b28b870422a74166`. D014's integration fixture overlay remains pending
as `FUP-dc1335f4d10f6a75`; a committed copy is still necessary to establish
F1's integration claim. [Close-register guidance](close-register.md) now
limits ER4-001's settled scope to guarded package suites and preserves
both remainders (D016).

The dependency manifests and product runtime source are unchanged; this
repair needs no component bump or evidence-edition remint. The existing
economy experiment D002 is retained, with no second experiment and no new
performance-saving claim. Test timings overlapped on the host and are
observations, not controlled performance estimates. Verification and final
review remain separate dispatches.
