# WO-078 independent verification evidence — VER-001

The operator dispatched `resume: verify`. The subject is branch `wo-078`
at base commit `b7741e38d68ac659921db757ac19054f84743495`, with current
implementation code identity
`d3718076f375b14c3bcbea5fd6f0691dfca07e77a05fcd829636a3e2c0ddbb05`.
Only verification evidence and its generated projections were written.
The tests create synthetic repositories under the system temporary root and
remove them; no real sibling checkout or remote service was changed.

## Independent attack

Reproduction from this worktree:

```sh
node scripts/harness.mjs bounded -- node docs/evidence/WO-078/verification-probe.mjs
```

The [probe](verification-probe.mjs) resolves the source Git root, initializes
and checks its synthetic Git root, uses relocated sibling and evidence roots,
and writes a five-field receipt against known manifest bytes. A simple purpose
edit, a version edit alone, a latest-receipt hash mismatch, and an undecodable
receipt all refuse without rewriting the page. Editing the visible versions
and the embedded tag record together exits 0 and prints `PASS`, although
Git still reports `v1.0.0` and the declaration and receipt are unchanged.
The desired check exit is 1. This is F1, a blocking criterion 1 finding.

The final run of the durable, formatted probe exited 0 in 658 ms: the script
successfully reproduced the failed refusal. Its earlier scratch run at
2026-10-11T14:09:22.772Z found the same bypass. A passing reproduction script
does not mean the subject met the required refusal.

```json
{
  "cutoff": "2026-10-11T14:13:06.511Z",
  "observations": [
    {
      "name": "relocated roots and no receipts",
      "checkExit": 0,
      "missingFields": 12,
      "generatorMs": 36,
      "registryBytes": 1610,
      "defaultDocsCreated": false
    },
    {
      "name": "receipt, root paths and destination names",
      "exactFields": true,
      "manifestHashMatches": true,
      "buildHashMatches": true,
      "checkExit": 0,
      "caseInsensitive": true,
      "remoteNameAccepted": true,
      "undeclaredSibling": null
    },
    {
      "name": "simple hand edit",
      "checkExit": 1,
      "refusal": "error: registry-store/README.md is stale at line 9; run node scripts/siblings.mjs index",
      "wroteNothing": true
    },
    {
      "name": "latest receipt hash mismatch",
      "checkExit": 1,
      "refusal": "error: registry-store/README.md: the Verifier.Starter entry records manifest hash `sha256:9f4bb2113fba4861b8e05dc1ac7eb6f24608404faf4e57a9ea7c33f4d12e0092`, and its latest receipt receipt-store/siblings/Verifier.Starter/2026-10-11T14-13-06-038Z.json records `sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`; run node scripts/siblings.mjs index",
      "wroteNothing": true
    },
    {
      "name": "undecodable receipt",
      "mode": "index",
      "exit": 1,
      "receiptNamed": true,
      "wroteNothing": true
    },
    {
      "name": "undecodable receipt",
      "mode": "index --check",
      "exit": 1,
      "receiptNamed": true,
      "wroteNothing": true
    },
    {
      "name": "visible version hand edit only",
      "checkExit": 1,
      "refusal": "error: registry-store/README.md is stale at line 11; run node scripts/siblings.mjs index"
    },
    {
      "name": "visible version and embedded tag record hand edit",
      "checkExit": 0,
      "expectedExit": 1,
      "falseVersion": "v9.8.7-forged",
      "trueGitTag": "v1.0.0",
      "receiptUnchanged": true,
      "declarationUnchanged": true,
      "pageRemainsForged": true,
      "output": "NEWER tag evidence for a08a28cc28e8: v1.0.0; the page keeps its recorded observation; run node scripts/siblings.mjs index to refresh\nPASS registry-store/README.md is current"
    },
    {
      "name": "later tag without page edit",
      "checkExit": 0,
      "originalVersionPreserved": true,
      "output": "NEWER tag evidence for a08a28cc28e8: v1.1.0; the page keeps its recorded observation; run node scripts/siblings.mjs index to refresh\nPASS registry-store/README.md is current"
    },
    {
      "name": "independent update-plan ownership and interruption variations",
      "convergedAccepted": true,
      "localEditRefused": true,
      "pendingBytesAccepted": true,
      "missingWithoutPendingRefused": true,
      "droppedPendingPathReadded": true
    }
  ]
}
```

The probe also verifies that a later legitimate Git tag preserves the
original page and does not fail the check. A repair must distinguish this
case from the forged observation. Its isolated update-plan variations accept
converged incoming bytes and journaled interrupted bytes, refuse a genuine
local edit, refuse an absent still-carried file without a pending journal,
and re-add a path the pending journal had dropped.

## Affected executable checks

Every command below ran one process at a time through the bounded wrapper.

| Command after `node scripts/harness.mjs bounded --` | Result | Wrapper duration |
| --- | --- | ---: |
| `node --test scripts/test-siblings.mjs` | 10 passed, 0 failed, 0 skipped | 4,663 ms |
| `node --test --test-name-pattern='WO-078 criterion 1\|export update' scripts/test-launchpad.mjs` | 12 passed, 0 failed, 0 skipped | 51,385 ms |
| `node --test scripts/test-configuration-root.mjs` | 14 passed, 3 failed including the parent test | 2,781 ms |
| `env -u CODEX_THREAD_ID node --test scripts/test-configuration-root.mjs` | 17 passed, 0 failed, 0 skipped | 4,564 ms |

The initial configuration run failed two lifecycle cases with
`Codex writer reservation unavailable; harness runtime is not built`.
Those fixture repositories copy scripts and library modules, without the
built runtime, and the two calls inherit the environment.
`scripts/lib/suite-evidence.mjs suiteEnvironment`, which the real runner
uses, omits `CODEX_THREAD_ID`. The changed-input rerun removes just that
marker from the child process and passes. This confirms the direct invocation
was outside the runner's fixture environment; it is not used to claim a
failing required product gate or a regression caused by the siblings root.

The export test checked the receipt's exact five fields against the exported
manifest and runtime snapshot, automatic regeneration, a byte-identical
rebuild, a second receipt from an update through a differently named checkout,
and the stale manifest-hash diagnostic. Its generator measured 63 ms for a
2,564-byte registry. The sibling fixtures measured 40 ms for 1,615 bytes
without receipts and 98 ms for 2,852 bytes with two receipts. These are host
observations, not promised bounds.

The update cases cover real interrupted writes, retrying at a later source
commit, adopting the first of two partly completed renames, convergence,
collision ownership, opt-in, child-root relocation, and the exported resident.

## Product-gate reuse

The bounded identity read at 2026-10-11T14:10:07.403Z and the repeat after
filing the probe at 2026-10-11T14:13:06.997Z both reported the code identity
above and found the executor's complete passing `npm test` row:

- Recorded at 2026-10-11T04:05:05.175Z; exit 0; executed true.
- Duration 1,355,410 ms; tree `ef55ed1ebdc9ae20ee99790999d1eb7f2d5931f0`.
- `identityUnchanged: true`; `buildOutputUnchanged: true`.
- Evidence `host-gate:d3718076f375b14c3bcbea5fd6f0691dfca07e77a05fcd829636a3e2c0ddbb05:npm test`.

The executor's [handoff](handoff.md#executed-evidence) identifies this run as
`npm test -- --review`, 38 suites passed, 0 failed, 90 fresh tasks.
The reuse rule consumes this matching complete product row; verification
ran the affected probes instead of repeating the 1,355-second review gate.

## Implementation and worker review

After the independent attack, the verifier reviewed the whole implementation
diff, the three new scripts, affected tests, declarations, current registry
and cited design sections. The strongest lenses were correctness, rule
beating, operator recovery, platform fit and maintainability: the feature
is a reusable typed receipt and generated CLI projection, and its check is
on every document gate.

The two worker reports and executor dispositions were then read from
[self-review.md](self-review.md). The targeted tests reproduce the receipt,
renamed destination, unknown-commit reporting, refusal diagnostics,
declaration validation, automatic regeneration and update-recovery fixes.
The independent later-tag probe reproduces the reason for the frozen
observation, and the forged-record probe exposes a failure in that repair.

The three nonblocking recorded findings remain in source: post-build
absent-file refusal, omitted ordinary summaries on post-manifest errors,
and duplicated small validators/stale-line logic. They are preserved as
the structured [D009](decisions.md#wo-078-d009--preserve-the-worker-dispositions-as-structured-follow-ups)
follow-up. F1 reopens D002 through
[D008](decisions.md#wo-078-d008--verification-a-forged-tag-observation-defeats-the-required-hand-edit-refusal).
The existing author-identity and fixture-data carry-ins remain at their
original dispositions. No new implementation suppression, dependency or
architecture change was introduced by verification.

## Limits and cost

Only synthetic destinations were exported or updated. The actual starter
and Angular declarations are read from the repository and still have no
receipts, with every receipt-supplied field marked `not evidenced`.
No Angular execution, network behavior or private instance data was needed
for the order's declared criteria.

D003 records the removed lookup as one sibling-checkout read per sibling
per occasion, with wall-clock unmeasured. The generator cost was measured
above; no net time saving is claimed. Using the existing complete product
row saves repeating an observed 1,355,410-ms run while independent probes
still test the consequential claims. No worker or background monitor was
started by the verifier; bounded-command supervisors finished with their
commands. The session's hard USD 5 cap is unenforced because the available
transport exposes no hard dollar-cap control.

Verification uses the existing Git/control/receipt and harness evidence
instruments; the harness under the project also recorded these runs.
Independent assertions about exit codes, unchanged bytes and live Git tags
establish F1 rather than relying on the subject's own `PASS` message.


## Required check results

`npm run format:check` exited 0: all matched files use Prettier style.
`npm run test:docs` passed 33 checks, 0 failed, 33 fresh tasks in
102,007 ms, recorded at 2026-10-11T14:15:47.548Z with code identity
`d3718076f375b14c3bcbea5fd6f0691dfca07e77a05fcd829636a3e2c0ddbb05`,
`identityUnchanged: true` and `buildOutputUnchanged: true`.
The publication, siblings, index, meta and registration rows all passed.
`git diff --check` exited 0. The diff of `package.json`, `package-lock.json`
and `packages/` is empty, so the subject introduces no dependency.

The document checker emitted two advisory rows for preexisting WO-189
operator-attributed prose. Those rows did not fail the gate and were outside
this verification's write authority. No implementation was edited to silence
them. The current decisions-index rows and follow-up register contain D008
and D009; the meta generator and its document check passed.
