# WO-077 implementation handoff

The executor completed `resume: next` on 2026-10-10. The update command
refreshes the kit from committed core inputs while preserving locally
edited files and instance ownership. Instance actions require both
`kit.applyInstanceActions: true` and `--apply`. The observed outcome matches
the goal-alignment choices in [D002](decisions.md#wo-077-d002--preserve-kit-ownership-across-repeated-updates).

**Criterion 1:** met — The launchpad fixture replaces unmodified kit files, retains and lists modified and dropped-modified files with their prior hashes, preserves instance and overlay bytes, removes unmodified dropped files, adds new files, refreshes the manifest and UPSTREAM.md, and prints the re-emit command. Repeated updates preserve refusals and instance-owned new-path collisions. See [fixtures](fixtures.md) and the passing final launchpad suite below.

**Criterion 2:** met — Typed dated declarations print in both modes; `--apply` requires the boolean opt-in and applies/lists only the three declared mechanical kinds. Missing, malformed, array-valued manifest fields, unreadable kit inputs, unknown action kinds and invalid later actions refuse before writes. Configured opt-in without `--apply` preserves instance bytes; repeated actions preserve existing defaults and avoid duplicate phrase replacement. See [D003](decisions.md#wo-077-d003--opt-in-and-typed-mechanical-actions), [self-review](self-review.md), and the passing launchpad/configuration-root suites.

**Criterion 3:** met — The fixture loads ResidentHost and materializeOrder from the exported runtime, leaves the host open across an opted-in update, observes byte-identical log contents, restarts using the updated runtime, derives the same WO-900 identity and dispatches the pending cadence once at dueAt 10. The final launchpad suite passed; [fixtures](fixtures.md) records the resident observation and [D005](decisions.md#wo-077-d005--resident-fixture-corrections-and-preserved-continuity) records the corrected fixture setup.

**Criterion 4:** met — The client README has upstream-update and opt-in sections, and the exported contract template states the opted-in exception. Product 07's existing roots section lists `kit` and the default-false field in place, growing by 156 bytes. Decisions D001–D006 and their generated index entries exist. Publication source locks are refreshed; publication and document checks passed. See [decisions](decisions.md).

**Criterion 5:** met — `npm run test:docs`: 32 passed, 0 failed; `npm test -- --review`: 29 suites passed, 0 failed, 81 fresh tasks. Both recorded unchanged code and build outputs. `git diff --check` passed. No package, package-lock or component source changes and no new dependency. Gate rows and identity are below.

self-review: found 2; fixed 2; recorded 0 — [criteria adversary](self-review.md#criteria-adversary-report): 1/1/0; [design improver](self-review.md#design-improver-report): 1/1/0. Both independently found the same scalar-coercion defect, fixed once with two refusal cases. Two fresh read-only workers received only the order and diff; supplied `gpt-6.1-sol / max`, effective readback unobserved, no descendants. Session fan-out: 2 of 20.

## Executed evidence

Final tested code identity:
`43d2cf9cabeb65c9b603ec693c34114d2987c6a968d958e103cd7d73a2377e09`.
Rows are retained in the ignored `docs/control/local/harness/checks.json`
and its history; neither gate reused a task.

| Command | Recorded at (UTC) | Result | Duration |
| --- | --- | --- | --- |
| `npm run test:docs` | 2026-10-10T04:35:13.925Z | 32 passed, 0 failed, 32 fresh tasks | 104,975 ms |
| `npm test -- --review` | 2026-10-10T04:53:33.024Z | 29 suites passed, 0 failed, 81 fresh tasks | 1,094,429 ms |

The review row has `gateSelection: review`, `exitCode: 0`,
`identityUnchanged: true`, and `buildOutputUnchanged: true`. Its launchpad
suite passed in 94,275 ms, including the update parent test in 43,612 ms;
configuration-root passed in 5,737 ms. No repository writes or new workers
occurred during the final gates. The first documentation attempt found a
premature link to this handoff; D006 records its correction before the
passing run.

`npm run release -- prepare --local` assigned v0.74.0.
`npm run release -- check-surfaces --local` passed with existing publication
controls retained. The adjacent queue is empty at revision 0. The worktree
scan found no nested repositories outside ignored intake; the fixture
repositories were temporary and cleaned up. No executor-started background
task remains.

The shared-preparation comparison in D004 produced identical kit bytes
with less staging work in one measured local sample. Whole-update rollback
after a disk failure is outside this implementation's preflight guarantee,
as recorded in D002. Verification and final review remain separate roles.

Executor attestation: `codex-cli 0.162.1`, `gpt-6-astra`, effort `max`, source
`codex-session-readback`. Final usage counters belong in the ignored receipt
and response, not this handoff.
