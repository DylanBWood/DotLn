# WO-080 verification 001 — method and probes

Subject: worktree `wo-080`, base `873e8c0ca00fb0fc74a586e6eb9cc9bca1977be6`,
gate code identity
`6a931dea2e266c39b20dd81718bbd538efcd36df8d9424ad8618089e98428d65`. The
verdict and criterion judgments are in
[VER-001](../../../verifications/WO-080/VER-001.md).

Every probe ran under `node scripts/harness.mjs bounded --`, one process at a
time, outside any gate. Fixtures were built in the session's scratch
directory, never in the worktree. [probes.json](probes.json) holds the
selected results with physical paths removed.

## Probes

- [index-probe.mjs.txt](index-probe.mjs.txt): 32 variations over the real-Git
  two-target index fixture (`scripts/test-workstream-index-fixture.mjs`).
  Every column was checked against my own `git rev-parse` and
  `merge-base --is-ancestor`. The probe also checks the absence of physical
  paths, including the `realpath` spelling, and a check run from another
  working directory. Forged records: an inconsistent stale mark, a phase
  changed only in the record, a consistent target commit, a removed record
  and a doubled record. It covers a diverged target, one unreadable target, a
  declared base missing from the target's objects, the field outside the
  leading header, a second field, duplicate and mismatched document ids, an
  unknown track, a member with no order, an omitted member, a mismatched
  repository and an unknown edge target. The last cases are a self member on
  `main` and after a branch commit, and a separate-track member inside a lane
  pair. All 32 hold as recorded; V16b is the observation behind
  [WO-080-D015](../decisions.md#wo-080-d015--ver-001-pass-board-the-self-members-checkout-dependent-integration-reading).
- [absent-probe.mjs.txt](absent-probe.mjs.txt): `index --check` passes with
  both clones deleted, and again with the ignored clone map deleted.
- [board-probe.mjs.txt](board-probe.mjs.txt): projects all six manifest cases
  from their pinned inputs. Each view is schema-valid and reproduces its
  expected JSON, text and HTML. For the five older cases, the JSON after
  removing only `workstreams` equals the base's JSON. Its text and HTML
  renders equal the base's text and HTML. The stripped view still validates
  and renders without the section.
- The pilot, run three ways:
  - Through the runner (`npm test -- --only workstream-pilot`): passed, with
    the pilot task taking 27.91 s.
  - Directly with `node --test`: all four named demonstrations passed.
  - As a scratch copy printing the second writer's hook output, with D1
    skipped: D4's deny comes from the compiled writer unit, with the first
    session and the other worktree both admitted.
  - Run alone, D4 fails, because it reads D2's members; this is
    [WO-080-D016](../decisions.md#wo-080-d016--ver-001-board-the-pilot-demonstrations-shared-state-and-d2s-self-confirming-proof).
- `npm test -- --only index` and `npm test -- --only release-surfaces`
  passed. Both are generated checks, which the structural `generated` task
  runs in every row.

Read-only checks in the worktree:

- `npm run format:check`, `git diff --check` and
  `npm run work-orders -- index --check`.
- The byte identity of the pinned inputs and the schema against the base.
- The manifest comparison.
- The dependency manifests.
- A recomputation of changed paths against `evidenceSources`.

The receipt 053 trigger figures come from the executor's
[gate-results.json](../gate-results.json) and are recorded in
[WO-080-D017](../decisions.md#wo-080-d017--ver-001-both-of-receipt-053s-reopening-triggers-for-criterion-5-fired).

To rerun a probe, copy its `.mjs.txt` to a `.mjs` file outside the
repository, then run it from the repository root with a scratch directory
argument.
