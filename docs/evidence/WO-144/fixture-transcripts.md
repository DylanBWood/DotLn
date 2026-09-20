# WO-144 fixture transcripts

Executed locally on 2026-09-19. Paths below are fixture-relative shapes, not
operator folders. Tests emit generated hooks into disposable fixture repositories
and invoke their protocol before permitting any simulated file effect.

## Bounded acceptance run

Command:

```sh
node --test --test-name-pattern='WO-039 confirmed-token|WO-144' scripts/test-harness.mjs
```

Observed terminal summary:

```text
PASS WO-039 confirmed-token adapter uses the compiled correction and survives independent prompt bookkeeping
PASS WO-144 typed correction removes outside-write grants, including reused correction state
PASS WO-144 generated hooks apply active-role grants to physical writes and removals
PASS WO-144 equipped support grants are attributable and disappear when unequipped
PASS WO-144 unreadable grants advise once and preserve all four existing refusals
PASS WO-144 scratch-only role grant is session-scoped and main intake must be ignored
tests 6; pass 6; fail 0; duration_ms 12824.254709
```

Observed assertions within those tests:

| Request/state | Expected and observed result |
| --- | --- |
| Write or shell redirect into granted temporary/scratch | admitted |
| Same forms into parent, sibling or fixture home/Documents | denied, destination and missing grant named |
| Granted-root symlink escaping to fixture home | denied |
| Remove ungranted outside entry | denied; no-follow unlink of granted entry admitted |
| Known ungranted first target, invalid later target | first denial retained |
| Opaque command | admitted and journaled unobserved |
| No active role | no default outside grant |
| Operator override / off | admission / restored refusal |
| Equipped support plus independently admitted operator root | that root admitted, sibling denied |
| Unequipped support; missing registry; expired/denied/missing evidence | refused or rejected at the appropriate boundary |
| Unreadable root configuration | one advisory across hooks, cause journaled, existing four refusals retained |
| In-project write with broken root configuration | no outside-grant judgment |
| Stale runtime pin | existing advisory delegation retained |
| Scratch-only declaration with another session | denied |
| Main-intake declaration in linked worktree | ignored intake admitted, sibling denied; unignored intake advises |
| Hard typed correction, fresh and reused state | outside effects removed; subsequent temporary write denied |

## Compiler and runtime regression selection

```sh
node --test packages/compiler/dist/test/*.test.js packages/skeleton/dist/test/executor-supports.test.js packages/skeleton/dist/test/feedback-v2.test.js packages/skeleton/dist/test/harness-input.test.js packages/skeleton/dist/test/presence-signals.test.js
```

Observed: 137 tests, 137 passed, 0 failed; duration 5,123.363583 ms.
This includes pure lowering/provenance, historical saved graph identity,
active-grant round-trips, correction, input validation and presence behavior.

The first run of this selection had one old round-trip expectation comparing
the saved graph without grants to the newly granted active program. The test
now compiles each active view with explicit grants and independent registry
while retaining the historical saved-graph hash assertion. The rerun above
is the passing result; the intermediate failure is not omitted.

## Generated harness regression suite

Command: `node --test scripts/test-harness.mjs`.
The pre-correction version passed 104/104 in 146,382.438542 ms.
The final rerun passed 105/105, 0 failed, duration 148,650.270333 ms.

## Other executable checks

- `npm run build`: passed.
- `node scripts/harness.mjs check`: 31 generated surfaces passed.
- `node scripts/authority-evidence.mjs --check`: revision 001 passed; 34 bundle comparisons, grant admission/reversal and runtime denials.
- `node scripts/artifact-identity-evidence.mjs --check`: four files passed; frozen identities unchanged.
- `node scripts/verification-evidence.mjs --check`: four synthetic files passed.
- `node scripts/feedback-evidence.mjs --check`: ten regressions and ten expected removal failures passed; matched instruction saving 1,192 bytes.
- Live feedback audit: phase complete, ten criteria; independent `codex-cli-exec` verifier.
- `node scripts/release.mjs check-surfaces --local`: release, component pins, licenses and publish-refusal checks passed.
- `node scripts/harness-context.mjs`: all configured ceilings met; totals in implementation report.
- `node scripts/console-fixtures.mjs --check`: all five cases match after the existing current-selfhost recorder refreshed that case's evidence pins.

The first `npm run test:docs` run passed 18 tasks and failed the console-document
task because its tester fixture still referenced the previous feedback policy
edition. The existing current-selfhost recorder repinned the checked WO-144
edition and regenerated only that case; no runtime or assertion was changed.

The rerun of `npm run test:docs` passed all 19 tasks in 15.64 seconds.
The full console suite separately passed 21/21 in 14,934.75975 ms.
`node --test scripts/test-authority-grants.mjs` passed 3/3 in 69.934041 ms
after its old no-grant projection expectation was updated to assert the new
provenance labels and reject unsupported default declarations on a synthetic
one-grant build. Its first run had 2 passes and that one expectation failure.
`git diff --check` passed.

No real operator-folder write or native-sandbox containment probe is claimed.
`npm test` remains the final-review product gate specified by the order.

## Repair of FINAL-001 (2026-09-19)

Command, run against the regenerated bundle:

```sh
node --test --test-name-pattern=WO-144 scripts/test-harness.mjs
```

Observed terminal summary:

```text
PASS WO-144 typed correction removes outside-write grants, including reused correction state
PASS WO-144 repair admits null discards and exposes scratch with single consistent observations
PASS WO-144 generated hooks apply active-role grants to physical writes and removals
PASS WO-144 equipped support grants are attributable and disappear when unequipped
PASS WO-144 unreadable grants advise once and preserve all four existing refusals
PASS WO-144 scratch-only role grant is session-scoped and main intake must be ignored
PASS WO-144 FINAL-001 F1 a moved working directory is still judged and journals in the hook's own project
PASS WO-144 FINAL-001 F2 a literal redirect is judged on any program while the program stays unobserved
tests 8; pass 8; fail 0; duration_ms 26923.870833
```

The first run of the two new fixtures failed on the fixture's own spelling: a
quoted operand attached to its operator (`2>'/path'`) is opaque to the existing
scanner by design. The fixtures now use the spaced form and pin the attached
form as stated width. No assertion about the repair was weakened.

| Request/state | Expected and observed result |
| --- | --- |
| Input `cwd` is a project subdirectory, a directory outside any repository, or another repository's root; absolute redirect, write-tool path, removal, `npm run meta 2> <outside>` | denied by the permission, writer and write-observer hooks, naming destination, missing grant and role |
| Same three directories; granted temporary redirect, in-project write, opaque command | admitted |
| From `docs/nested`: `printf x > ../../../escaped-parent.txt`, `npm run meta 2>../../../.x` | denied: relative destinations resolve against the session directory |
| From `docs/nested`: `printf x > ../../fixture.ts`, `touch beside.md` | admitted: in-project, never judged |
| From another repository's root: `touch in-another-repository.txt`; from outside: `printf x > home/Documents/new.txt` | denied |
| Run only what the hook admits from the moved directory | the documents-like probe file is not created |
| Journal after the run | refused, granted and unobserved rows all carry `workingDirectory: moved`; both stand-down causes have an advisory row; the other repository contains only `.git` (adjacent-0003) |
| From the root afterwards | the same outside redirect is denied and an in-project write admitted, as before |
| `npm run meta 2>../.x`, `node … > <outside>`, `git status &> <outside>`, `cd docs && npm run meta 2> <absolute outside>` | denied |
| `npm run meta 2>$PWD/../.x`, `cd docs && npm run meta 2>../../.x`, in-project redirect, null discard, granted redirect | admitted: the stated unjudged width and the legitimate cases |
| Granted redirect on `npm`, then in-project redirect, then null discard | rows: granted (`system-temp`) then unobserved; unobserved; unobserved |
| Accessor table, 15 spellings | `shellWriteTargets` stays `null` for every unrecognized program, so the live-gate reading is unchanged |
| `planning/` branch: `npm run meta > fixture.ts`; `printf x > fixture.ts` | admitted as before; refused as before |

Live probes in this Claude Code session under the regenerated hooks, role
executor, darwin, after one persisted `cd docs`:

| Time (UTC) | Call | Result |
| --- | --- | --- |
| 2026-09-20T00:03:13.219Z | `printf 'probe\n' > /private/tmp/wo144-fix-cwd-probe.txt` (the form FINAL-001 saw admitted, with a different file name) | refused before execution; journal row 689, `workingDirectory: moved`; file absent |
| 2026-09-20T00:03:19.449Z | `node -e 0 2>/private/tmp/wo144-fix-redirect-probe.txt` | refused before execution; row 695; file absent |
| 2026-09-20T00:03:21.647Z | `cd <root> && pwd && ls …` | admitted, unobserved, row 700 marked moved |

Six stand-down advisory rows were journaled while the directory was moved.
Before the change, the generated permission hook given `cwd` at a scratch
repository's root created `docs/control/local/harness/<key>.jsonl` and an
`.advisory` marker inside that repository; the fixture now asserts it cannot.

adjacent-0004, found afterwards in the generated fallback: with no loadable
runtime, a copied permission hook given `cwd` elsewhere wrote its row and
marker under that directory. The F1 fixture now removes the runtime and invokes
from all three moved directories. Against the earlier build it failed with
`actual: [ '.git', 'docs' ]` for the other repository; after the change all
eight WO-144 fixtures pass and the full suite is 108 passed, 0 failed,
169,046 ms, with authority evidence at revision 004.

Other checks before adjacent-0004: `node --test scripts/test-harness.mjs` 108
passed, 0 failed, 162,382 ms; `node scripts/harness.mjs check` 31 surfaces;
`node scripts/authority-evidence.mjs --check` revision 003; artifact identity,
verification and feedback editions still pass; `npm run publication:check`
current after both source locks were refreshed; `npm run test:docs` 19 passed
after the authority revision (13 passed, 6 failed before it, all on the stale
revision 002); `node docs/evidence/WO-144/inventory.mjs` counts 3 moved-directory
judgment rows and 6 stand-down rows in this worktree.
