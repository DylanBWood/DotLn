# WO-253 — VER-002 evidence

Observed 2026-11-04 on macOS, Node v26.9.0, in the selected WO-253
worktree. The implementation remained at code identity
`e5f635cdbccb3664a97a6dfc77ab629a4ab4eaf82a1f7bf93d3a13e1281803fd`
above `1bcf9af5bfc6b8f887724c373088717043748a95` throughout the probes.

## Gate evidence and probes

`coveringGateCheck` for `npm test` with the six declared Preflight suites
returned the worktree's complete passing row, recorded
2026-11-04T12:27:59.683Z, with `missing: []`, `exitCode: 0` and
`identityUnchanged: true`. Its evidence reference is
`host-gate:e5f635cdbccb3664a97a6dfc77ab629a4ab4eaf82a1f7bf93d3a13e1281803fd:npm test`.
D042 records its `npm test -- --review` invocation, 46 passing suites and
120 fresh tasks in 0 h 38 min. The structural row and the subsequent
runner-fixtures and license-fixtures rows are also passing at this identity.
No complete product gate was repeated.

Every behavioral command below ran sequentially under
`node scripts/harness.mjs bounded --`. Times are UTC on 2026-11-04;
cutoffs refer to the command's completion, not a later narrative.

| Command after the bounded prefix | Observed result | Cutoff |
| --- | --- | --- |
| `node docs/evidence/WO-253/VER-001-budget-probe.mjs` with session scratch | Prior F1 reproduction passes: one check after expiry, zero deletions after expiry, snapshot retained, remaining 1, stop at removal. | 14:32:35.985 |
| `node --test scripts/test-temporary-roots.mjs` | 95 tests passed. Includes record and journal proofs, unknown/live owners, replacement identity, nested retention and mode restoration, permission failures, 2,000-root budget/resume, snapshot/lane/stash stops, default and invalid budget values. | 14:33:09.643 |
| `node --test --test-name-pattern="a passed suite's fixture roots leave" scripts/test-runner.test.mjs` | One named test passed: two passed roots gone before the next suite starts; failed root remains with outcome failed. | 14:33:53.771 |
| `node --test --test-name-pattern='WO-253 plan start' scripts/test-plan-refutation.mjs` | One named test passed: small-budget partial report, large root retained, all six timing lines, branch and document created; unset budget removes three roots. | 14:34:09.710 |
| `bash scripts/test-release.sh --case close_completion` | Passed with closed-order removal, foreign roots preserved, restricted directory handled, prune row fields and scope/timing output asserted. Publication is fixture-local. | 14:34:50.949 |
| `node docs/evidence/WO-253/VER-002-probes.mjs` with session scratch | Independent repository-scoped CLI and later stash-batch assertions passed; details below. | 14:36:12.935 |
| `node --test --test-name-pattern='the npm dry run removes its own scratch' scripts/test-license-surfaces.mjs` | One named test passed: own scratch removed and an earlier failed run's root preserved. | 14:36:46.241 |
| `bash scripts/test-fixture-temp-root.sh` | Passed. Ten roots: one root-liveness snapshot, zero byte inventories, one additional lease snapshot. Twenty roots with a live writer: two writer views and two ps calls, all roots retained. | 14:36:57.379 |
| `node scripts/license-surfaces.mjs` | Passed all declared license checks and dry-run refusal checks. | 14:37:40.232 |
| `npm run publication:check` | Passed: 256/256 headings indexed; both publication source locks current. | 14:38:02.418 |
| `node scripts/harness.mjs check` | Passed: 42 generated surfaces. | 14:38:08.227 |

`npm run format:check` passed on the implementation before report authorship.
The authored probe and receipt are formatted only at their own paths.
The post-edit `npm run test:docs` row and inline `git diff --check` are
consumed by the result transition; the immutable report is filed only after
those checks succeed.

## Independent variations

The [filed probe](VER-002-probes.mjs) creates disposable Git repositories
under session scratch, verifies their physical roots, and changes only them.
The CLI runs from the fixture repository with `DOTLN_PRUNE_SCOPE=repository`.
It removed four expired record-proven roots (two gate fixtures, a capture and
session scratch), including an unreadable file and mode-000 directory, and
one expired journal using inventory proof. A recent journal, failed fixture,
malformed record and unmarked root stayed. An intercepted preview observed
zero reads of record-only or retained payloads. The CLI counted one
root-liveness snapshot and one byte inventory. A repeated apply removed zero
roots. Warm-root behavior is covered by the fresh temporary-roots tests;
the CLI fixture does not invent a warm-cache current key.

The second variation creates a supported integration stash with 80 distinct
changed files. It advances the documented budget clock only after the first
32-object blob batch has actually returned. Exactly one batch runs; the
inventory stops in `plan`, retains the stash as `budget`, and reports one
remaining item. An unbounded resumed prune removes the stash and reports
zero remaining. This extends the executor's case, which expires before the
first inventory operation, without editing implementation.

The shell fixture reports its historical ungated parent retention for
intentionally replaced nested owners. That diagnostic is not a newly leaked
passed gate root; D025 records the same ungated behavior and the complete
row covers its gated cleanup.

## Review and limits

The review traced the original change and repaired paths through the
shared remover, owner and ledger judgment, runner cleanup/reuse, planning
and release callers, budget readers, declaration floor, tests, guides,
generated roles, runtime snapshot and version manifests. The lockfile and
manifests change only the local skeleton version/pin; no dependency was added.
The source diff introduces no lint or type suppression directive.

The original execution's three review rounds, repair-1's three rounds,
repair-2's two rounds, VER-001, and the executor dispositions were read.
Existing follow-ups in D013, D019, D025 and D041 remain recorded. No new
criterion failure or reproduced regression was found. Generated surfaces
stand on their check and the current complete row; they are not inferred
correct from a generator's invocation alone.

The tests vary owner liveness, null/failed retention, malformed or replaced
records, nested ownership, permission denial, partial deletion, repeated
apply, explicit/unset budgets, current and stale warm roots, and foreign
close scope. The repair is also exercised beyond its original snapshot
failure through lane proofs and a later stash batch. Desktop interaction
and browser behavior are outside this machinery change.

This verification does not measure a live host-wide apply, a real backlog
lasting 0 h 30 min, Linux behavior, or the order's eventual release close.
The later-phase plan/close measurements remain assigned as D028 and D042
state. One root-liveness snapshot does not mean one process query for every
kind of bookkeeping: lease registration and writer views have the separately
observed reads described in the guides. Ledger retirement is expressly
unbounded closing bookkeeping. No total real-time deadline beyond those
specified semantics is claimed.

[D043](decisions.md#wo-253-d043--ver-002-probe-and-read-corrections) records
probe setup, unmatched selection, truncated-read and gate-id corrections;
those failures supply no product verdict. The corrected probe removed its
own disposable repositories in `finally`.
