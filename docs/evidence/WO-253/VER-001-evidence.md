# WO-253 VER-001 evidence

Independent verification on 2026-11-04. The subject is the working tree above
`1bcf9af5bfc6b8f887724c373088717043748a95`, code identity
`fefe737574e933a2449f608f9cc88deabe1b9c2ae9afdb88f8cb66e5256bbe65`.
The verifier changed evidence and lifecycle records only.

## Standing gate and fresh probes

`coveringGateCheck` returned the passing complete review row recorded
2026-11-04T08:29:35.923Z, executed with exit 0 and unchanged identity:
46 suites passed, 120 fresh tasks, 0 h 35 min. Its coverage includes structural
and all six declared Preflight suites. No complete product gate was repeated.

Every fresh probe below ran sequentially under
`node scripts/harness.mjs bounded --`. All returned exit 0. Full logs remain
in this session's ignored scratch; these are the verdict-relevant observations.

| Probe | Observation | UTC completion |
| --- | --- | --- |
| `npm run format:check` | All matched implementation files use Prettier style. | 09:37:11.868 |
| Selected cases in `scripts/test-temporary-roots.mjs` | 15 passed: record proofs, unreadable entries, bounded inventory/deletion, 2,000-root discovery/resume, restored permissions, nested remainder counts and interrupted census. | 09:37:26.124 |
| Independent isolated `harness prune --apply` CLI fixture | Five roots removed: four record proofs and one expired-journal inventory proof. One snapshot and one byte inventory. Failed and live roots retained; unknown process table retained its root; replaced identity refused; unmarked/malformed payload reads zero. | 09:39:18.079 |
| Suite-end and license cleanup cases | Two passed: passed suite roots removed, failed suite outcome retained; license dry-run removes its own scratch and preserves the planted prior failed root. | 09:39:32.952 |
| `WO-253 plan start` case | Passed: budgeted partial result, large root kept, branch/pass creation, six timing lines and unset-budget removal. | 09:40:02.292 |
| `bash scripts/test-release.sh --case close_completion` | Passed: closed-order scope, foreign gate retained, permission repair, row fields and summary. Uses fixture publication. | 09:40:40.571 |
| `bash scripts/test-fixture-temp-root.sh`, isolated `TMPDIR` | Passed: ten roots use one snapshot; live-writer reads measured separately; close-only scope excludes the unrelated registered roots. | 09:44:16.958 |
| `npm run publication:check` | Passed, including 256/256 product headings. | 09:44:45.303 |
| `node scripts/license-surfaces.mjs` | Passed, including the seven package publish-refusal dry runs. | 09:45:43.687 |
| `node scripts/harness.mjs check` | Passed: 42 generated surfaces current. | 09:46:34.519 |

The selected Node test commands, after the bounded prefix, were:

```sh
node --test --test-name-pattern 'kit-owned root goes|entry its owner cannot|one-millisecond|two thousand|apply puts back|parent kept|kept parent queues|owner record its owner|re-check the budget|budget spent|listing asks|preview counts|census after a failed bounded|routine prune' scripts/test-temporary-roots.mjs
node --test --test-name-pattern 'passed suite.s fixture roots leave|npm dry run removes its own scratch' scripts/test-runner.test.mjs scripts/test-license-surfaces.mjs
node --test --test-name-pattern 'WO-253 plan start' scripts/test-plan-refutation.mjs
```

The fixture-temp-root shell probe retains its parent for deliberately replaced
nested owners when run outside a gate, as already recorded in D025 and its
named follow-up. Its fixture is inside this verifier's scratch. This is not
evidence that a passed gate suite leaked. The executor's complete-gate census
in D028 records none of that gate's own roots left.

## F1: budget expiry inside planned snapshot deletion

The [filed probe](VER-001-budget-probe.mjs) creates an isolated Git repository
and a normal unpinned `.runtime/harness/0123456789abcdef` snapshot with ten
small files. It calls the real `pruneHarness` in repository scope. Its
documented `budgetClock` fixture seam expires the budget when permission
preparation begins, after the candidate's proof recheck. Instrumented
`chmodSync` advances the clock; instrumented `rmSync` observes removal. No
host-wide prune runs. The probe restores both functions and deletes its own
fixture in `finally`.

Run from this worktree:

```sh
node scripts/harness.mjs bounded -- node docs/evidence/WO-253/VER-001-budget-probe.mjs "$(node scripts/harness.mjs scratch)"
```

The corrected run ended 2026-11-04T09:47:45.787Z with exit 1 at
`Budget expiry inside planned-root removal must report a partial stop`:

```json
{
  "probe": "planned snapshot deletion after budget expiry",
  "budgetMs": 1,
  "clockAtRemoval": 2,
  "checksAfterExpiry": 0,
  "deletedAfterExpiry": 1,
  "removed": [{ "kind": "snapshot", "path": ".runtime/harness/0123456789abcdef" }],
  "snapshotExists": false,
  "remaining": 0,
  "stoppedAt": null
}
```

The expected result is a budget stop with a remaining, resumable root. Instead,
`applyPlannedCandidate` calls `makeTemporaryWritable(row.absolute)` followed by
recursive `rmSync` without passing or checking the budget. The permission
walk recursively visits every child without a budget either. Checking before
the candidate and during its inventory does not bound these later operations.

This establishes missing checks after a supported operation consumes its
budget. It does not measure a wall-clock overrun on a large live host root.
The earlier scratch probe gave the same result. The first filed attempt was
invalid because logical/physical path inequality prevented clock expiry;
D029 records the correction and excludes that attempt.

Criterion 7 requires the guides to describe the bounded routine prune as
built. Both guides promise a check inside every walk and deletion; step 5
also requires interruption inside deletion. D030 records the blocking route
and repair rule. The separate publication-listing timeout noted in D022 is
not this reproduction.

## Review and limits

The verifier read the subject implementation, tests, changed guides and
generated-surface diff, plus all fourteen execution and repair review reports:
rounds 1 and 2 for criteria, design and consistency, and round 3 combined,
in both the main review lane and `repair-1`. The fresh probes revisit their
permission restoration, queued-root accounting, fixture lifetime and scope
claims. D013, D019 and D025 retain their existing named follow-ups; this report
does not reclassify them as new blockers.

Package diffs change only the skeleton version and its existing console pin;
there is no new dependency. `git diff --check` was clean before report filing
and is required again at completion. The documentation gate runs after the
last authored document edit and its row is consumed by verification completion.

The actual order's next planning pass and release close remain later-phase
measurements under D028. No live publication, cross-platform reproduction,
desktop session or host-wide apply was performed. The harness under test also
provided bounded execution and gate/usage accounting; the independent probe's
filesystem observations and assertions establish F1 without relying on its
summary formatter. No subagent was used.
